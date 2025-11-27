import moment from "moment/moment";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function ({ reqBody, isSpecial }) {
  const res = useSelector((e) => e.Restaurant);

  reqBody.is_scheduled = "";
  reqBody.schedule_date = "";
  reqBody.schedule_slot = "";

  if (!res.data.is_schedulable || !isSpecial) return null;

  return (
    <label
      className="d-flex flex-column gap-2"
      style={{
        color: "var(--primary)",
        fontWeight: "600",
        textAlign: "start",
        width: "fit-content",
      }}
    >
      <style>{`.MuiPickersArrowSwitcher-root{direction: ltr}`}</style>
      <span style={{ textWrap: "nowrap" }}>موعد الطلب</span>

      <span dir="ltr">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DateTimePicker", "DateTimePicker", "DateTimePicker"]}
          >
            <DemoItem>
              <DateTimePicker
                slotProps={{
                  textField: { fullWidth: true },
                  popper: {
                    placement: "bottom-end", // 👈 this aligns popper to the right
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 0], // optional: add small vertical spacing
                        },
                      },
                    ],
                  },
                }}
                onChange={handleTimeChange}
                minDateTime={dayjs(moment().subtract(1, "days").toISOString())}
                maxDateTime={dayjs(moment().add(7, "days").toISOString())}
                views={["year", "month", "day", "hours", "minutes"]}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </span>
    </label>
  );

  function handleTimeChange(time) {
    const newVal = moment(time.toString());

    reqBody.is_scheduled = true;
    reqBody.schedule_date = {
      date: newVal.format("YYYY-MM-DD"),
      day: newVal.format("dddd"),
    };
    reqBody.schedule_slot = {
      open: newVal.format("HH:mm"),
      close: moment(newVal).add(30, "minute").format("HH:mm"),
    };
  }
}
