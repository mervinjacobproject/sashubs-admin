import React from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import transition from "react-element-popper/animations/transition"
import opacity from "react-element-popper/animations/opacity"
import Settings from "react-multi-date-picker/plugins/settings"
 
 
export type PopoverDirectionType = 'up' | 'down'
 
interface Props {
  id: string;
  name: string;
  value: any;
  onChange: (value: DateObject) => void;
  placeholder: string;
  error: any;
  touched: any;
  minDate?: Date;
  openCalendar?: boolean;
  style?: React.CSSProperties;
  inputClass?: string;
  disabled?: boolean;
}
 
const Datepickers = (props: Props) => {
  const {
   id,name, value, onChange, placeholder,style,inputClass, disabled = false,
    ...restProps
  } = props
 
  return (
    <div style={{width:"100%"}}>
      <DatePicker
       id={id}
       name={name}
          hideOnScroll
      className="0"
       animations={[
        opacity(),
        transition({ from: 35, duration: 800 })
      ]}
        inputClass={inputClass ? inputClass : "custom-input"}
        format="DD/MM/YYYY"
        value={value}
       
       onChange={(value: DateObject) => {
          onChange(value);
        }}
        placeholder={placeholder}
        minDate={restProps.minDate}
        style={style}
        disabled={disabled}
        {...restProps}
      />
    </div>
  )
}
 
export default Datepickers