import { faCalendarDays, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactDatePicker from 'react-datepicker'

export interface DatePickerHandle {
  collect: () => Date
}

export const DateTimePicker = ({ dateTime, onChange, valid }: { dateTime: Date, onChange: (dateTime: Date) => void, valid: { date: boolean, time: boolean } }): JSX.Element => {
  const [dateId, timeId] = ['date-picker', 'time-picker']

  const onDateChange = (date: any): void => {
    onChange(date)
  }

  const onTimeChange = (date: Date): void => {
    const newDate = dateTime
    newDate.setHours(date.getHours())
    newDate.setMinutes(date.getMinutes())
    newDate.setSeconds(date.getSeconds())
    onChange(newDate)
  }

  return (
    <>
      <div className='field-container'>
        <label htmlFor={dateId}>Date</label>
        <div className='input-container'>
          <ReactDatePicker dateFormat="dd/MM/yyyy" selected={dateTime} onChange={onDateChange} className={`input ${valid.date ? 'valid' : 'invalid'}`} id={dateId}/>
          <FontAwesomeIcon icon={faCalendarDays} className="input-icon"/>
        </div>
      </div>
      <div className='field-container'>
        <label htmlFor={timeId}>Heure</label>
        <div className='input-container'>
          <ReactDatePicker showTimeSelect dateFormat="HH:mm" showTimeSelectOnly selected={dateTime} onChange={onTimeChange} className={`input ${valid.time ? 'valid' : 'invalid'}`} id={timeId} timeFormat="HH:mm" />
          <FontAwesomeIcon icon={faClock} className="input-icon"/>
        </div>
      </div>
    </>
  )
}
