import "./App.css";
import { TableComponent } from "./component/table-component";
import { getFormattedData } from "./utils/getFormattedData";

// since the data is static, data doesn't need to be calculated inside component
const { yearWiseData, cropWiseData } = getFormattedData();

function App() {
  return (
    <div className="App">
      <h2>Crop Production Year Wise data</h2>

      <TableComponent
        caption="Crop Production Year Wise data"
        headers={["Year", "Crop with Maximum Production in that Year", "Crop with Minimum Production in that Year"]}
        data={yearWiseData}
      />

      <h2>Average Yield and Cultivation Crop wise data</h2>

      <TableComponent
        caption="Average Yield and Cultivation Crop wise data"
        headers={["Crop", "Average Yield of the Crop between 1950-2020", "Average Cultivation Area of the Crop between 1950-2020"]}
        data={cropWiseData}
      />
    </div>
  );
}

export default App;
