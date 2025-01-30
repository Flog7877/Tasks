import React, { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import '../styles/muiFixes.css'

function MuiDateTimePicker({ label, value, onChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={label}
                value={value}
                onChange={onChange}
                ampm={false}
                format="DD.MM.YYYY HH:mm"
                slots={{
                    textField: TextField,
                }}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#ffffffde',
                                fontSize: '15px',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#ffffffde',
                                fontSize: '1rem',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#999',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'orange',
                            },
                        },
                    },
                    openPickerButton: {
                        sx: {
                            color: '#ffffffde',
                        },
                    },
                    desktopPaper: {
                        sx: {
                            backgroundColor: '#333',
                            color: '#ffffffde',
                            '& .MuiDayCalendar-weekDayLabel': {
                                color: '#fff',
                            },
                            '& .MuiPickersCalendarHeader-root .MuiIconButton-root': {
                                color: '#ffffffde',
                            },
                            '& .MuiPickersDay-root': {
                                color: '#ffffffde',
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export default MuiDateTimePicker;