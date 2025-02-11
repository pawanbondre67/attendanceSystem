import React, { useRef, useCallback, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View,Modal } from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import testIDs from "../testIDs";
import { agendaItems, getMarkedDates } from "../mocks/agendaItems";
import AgendaItem from "../mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "../mocks/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MeetingCard from "../../../meeting/meetingCard";

const leftArrowIcon = require("../img/previous.png");
const rightArrowIcon = require("../img/next.png");
const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}
const AgendaInfiniteListScreen = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({
    [new Date().toISOString().split("T")[0]]: {
      selected: true,
      marked: true,
      selectedColor: "white",
      selectedTextColor: "#1E8F5C",
    },
  });

  const { weekView } = props;

  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  // Function to handle marked dates
  const updateMarkedDates = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setMarkedDates({
      [formattedDate]: {
        selected: true,
        marked: true,
        selectedColor: "white",
        selectedTextColor: "#1E8F5C",
      },
    });
  };

  // Handle date change from DateTimePicker
  const handleDateChange = (event, date) => {
    setIsDatePickerVisible(false);
    if (date) {
      setSelectedDate(date);
      updateMarkedDates(date);
    }
  };

  // Handle date change from the calendar
  const handleCalendarDateChange = (dateString) => {
    const date = new Date(dateString);
    setSelectedDate(date);
    updateMarkedDates(date);
  };

  // Format the month name
  const formatMonthName = (date) => {
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const renderItem = useCallback(
    ({ item }) => {
      const { hour, duration, title, status, participants, organizer } = item;
  
      // Render the custom MeetingCard component
      return (
        <View style={{paddingHorizontal:20,flexDirection:'row'}}>
          <Text style={{fontFamily:"Montserrat-Medium",marginRight:15,}}>{hour}</Text>
       <View style={{flex:1}}>
       <MeetingCard
        title={title}
        time={`${hour} (${duration})`}
        status={status}
        participants={participants}
        organizer={organizer}
      />
       </View>
      </View>
      );
    },
    []
  );
  

  return (
    <CalendarProvider
      date={selectedDate.toISOString().split("T")[0]}
      onDateChanged={handleCalendarDateChange}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      <View style={styles.calendarHeader}>
        {/* Month Name and Calendar Icon */}     
          <Text style={styles.monthText}>{formatMonthName(selectedDate)}</Text>
        <MaterialCommunityIcon
         onPress={() => setIsDatePickerVisible(true)}
            name="calendar-month-outline"
            size={24}
            color="white"
            style={{ marginLeft: 8 }}
          />
      </View>

      {weekView ? (
        <WeekCalendar
          theme={{
            backgroundColor: "#1E8F5C",
            calendarBackground: "#1E8F5C",
            textSectionTitleColor: "white",
            selectedDayBackgroundColor: "white",
            selectedDayTextColor: "#1E8F5C",
            dayTextColor: "white",
            todayTextColor: "yellow",
            textDisabledColor: "gray",
          }}
          testID={testIDs.weekCalendar.CONTAINER}
          firstDay={1}
          markedDates={markedDates}
          onDayPress={(day) => handleCalendarDateChange(day.dateString)}
        />
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          theme={theme.current}
          firstDay={1}
          markedDates={markedDates}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          onDayPress={(day) => handleCalendarDateChange(day.dateString)}
        />
      )}

      <AgendaList
       scrollToNextEvent
       SectionSeparatorComponent={<></>}
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
        infiniteListProps={{
          itemHeight: 150,
          itemHeightByType: {
            LongEvent: 120,
          },
        }}
      />

      {/* Date Picker */}
      {isDatePickerVisible && (
  <Modal
    transparent={true}
    animationType="slide"
    visible={isDatePickerVisible}
    onRequestClose={() => setIsDatePickerVisible(false)}
  >
    <View style={styles.datePickerContainer}>
      <View style={styles.datePicker}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={(event, date) => {
            if (date) {
              handleDateChange(event, date);
            } else {
              setIsDatePickerVisible(false); // Close if no date selected
            }
          }}
        />
        {/* Close Button for iOS */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={() => setIsDatePickerVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </Modal>
)}
    </CalendarProvider>
  );
};

export default AgendaInfiniteListScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: "lightgrey",
  },
  section: {
    backgroundColor: lightThemeColor,
    color: "grey",
    textTransform: "capitalize",
  },
  calendarHeader: {
    backgroundColor: "#1E8F5C",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection:'row',
    justifyContent:'space-between',
    borderTopEndRadius:30,
    borderTopStartRadius:30
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  datePicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '90%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1E8F5C',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
