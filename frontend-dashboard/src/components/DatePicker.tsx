import { Component, onCleanup, createEffect } from "solid-js";
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/material_green.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  options?: flatpickr.Options.Options;
}

const DatePicker: Component<DatePickerProps> = (props) => {
  let datePickerRef: HTMLInputElement | undefined;

  createEffect(() => {
    if (datePickerRef) {
      const fp = flatpickr(datePickerRef, {
        ...props.options,
        defaultDate: props.value ?? undefined,
        onChange: (selectedDates) => {
          props.onChange(selectedDates[0] || null);
        },
      });

      onCleanup(() => {
        fp.destroy();
      });
    }
  });

  return <input ref={(el) => datePickerRef = el} type="text" />;
};

export default DatePicker;