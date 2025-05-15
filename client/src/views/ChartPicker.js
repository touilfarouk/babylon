import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const ChartPicker = ({ handleChartPickerChange, selectedChart }) => {
  const classes = useStyles();

  const chartTypesArray = [
    { value: 1, name: "Line Chart" },
    { value: 2, name: "Bar Chart" },
    { value: 3, name: "Pie Chart" },
  ];

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          {" "}
          Chart Type{" "}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selectedChart}
          onChange={(e) => handleChartPickerChange(e.target.value)}
          label="Chart Type"
        >
          {chartTypesArray.map((chart, i) => (
            <MenuItem key={i} value={chart.value}>
              {chart.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ChartPicker;
