import { Component, createSignal } from 'solid-js';

interface DatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePicker: Component<DatePickerProps> = (props) => {
  const [start, setStart] = createSignal<Date | null>(props.startDate);
  const [end, setEnd] = createSignal<Date | null>(props.endDate);

  const handleStartDateChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const date = value ? new Date(value) : null;
    setStart(date);
    props.onDateChange(date, end() ?? null); // Añadido ?? null para evitar el error
  };

  const handleEndDateChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const date = value ? new Date(value) : null;
    setEnd(date);
    props.onDateChange(start() ?? null, date); // Añadido ?? null para evitar el error
  };

  return (
    <div>
      <label>
        Fecha de inicio:
        <input type="date" value={start() ? start()!.toISOString().substring(0, 10) : ''} onInput={handleStartDateChange} />
      </label>
      <label>
        Fecha de fin:
        <input type="date" value={end() ? end()!.toISOString().substring(0, 10) : ''} onInput={handleEndDateChange} />
      </label>
    </div>
  );
};

export default DatePicker;