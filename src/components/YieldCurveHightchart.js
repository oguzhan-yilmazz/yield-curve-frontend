import "./YieldCurveHightchart.css";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import axios from "axios";
import AccessibilityModule from "highcharts/modules/accessibility";

AccessibilityModule(Highcharts);

function linearSplineInterpolation(x, x0, x1, y0, y1) {
  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

const YieldCurve = () => {
  /*
  const [businessDate, setBusinessDate] = useState("2000-01-01");
  const [targetDate, setTargetDate] = useState("2000-06-01");
  const [interpolatedYield, setInterpolatedYield] = useState(null);

  const maturities = [
    0.3315, 0.3507, 0.389, 0.4082, 0.5616, 0.8301, 0.9068, 1.1753, 1.5397,
    1.8082, 2.3644, 2.7288, 3.2849, 3.7644, 4.0521, 4.2247, 4.3205, 4.8, 7.4849,
    8.9425, 9.4027,
  ];

  const yieldToMaturity = [
    15.2643, 11.5097, 10.5723, 16.4457, 12.1326, 14.6857, 13.6542, 12.4703,
    15.1844, 14.9057, 13.5159, 14.5084, 13.7897, 13.8858, 12.4089, 15.2211,
    13.7252, 14.2092, 13.0775, 14.174, 13.438,
  ];
  */

  const renderInterpolatedData = () => {
    if (targetMaturity > maturities[maturities.length - 1]) {
      return (
        <div className="interpolatedData">
          <strong>Aralığın dışında bir tarih girdiniz!</strong>
          <strong>son tarih: {maturities[maturities.length - 1]}</strong>
        </div>
      );
    } else if (targetMaturity < maturities[0]) {
      return (
        <div className="interpolatedData">
          <strong>Aralığın dışında bir tarih girdiniz!</strong>
          <strong>ilk tarih: {maturities[0]}</strong>
        </div>
      );
    } else if (interpolatedYield !== null) {
      return (
        <div className="interpolatedData">
          <strong>
            Interpolated Yield for Target Date: {interpolatedYield.toFixed(2)}%
            <h1> </h1>
            Maturity : {targetMaturity} years.hi
          </strong>
        </div>
      );
    } else {
      return null;
    }
  };

  const [businessDate, setBusinessDate] = useState("2023-05-20");
  const [targetDate, setTargetDate] = useState(null);
  const [interpolatedYield, setInterpolatedYield] = useState(null);
  const [maturities, setMaturities] = useState([]);
  const [yieldToMaturity, setYieldToMaturity] = useState([]);
  const [seriesData, setSeriesData] = useState([]); // Yeni state değişkeni
  const [lowTargetYear, setLowTargetYear] = useState(null);
  const [highTargetYear, setHighTargetYear] = useState(null);
  const [shouldUpdateGraph, setShouldUpdateGraph] = useState(true);
  const [dataFetched, setDataFetched] = useState(true);

  const handleRangeChange = (e) => {
    if (e.target.value === "All") {
      setLowTargetYear(null);
      setHighTargetYear(null);
      setDataFetched(true);
    } else {
      const [low, high] = e.target.value.split("-").map(Number);
      setLowTargetYear(low);
      setHighTargetYear(high);
      setDataFetched(true);
    }
  };

  useEffect(() => {
    if (shouldUpdateGraph) {
      //https://yield-153eacdc3ce4.herokuapp.com/api/yieldcurve/calculate
      axios
        //.get("http://localhost:8080/api/yieldcurve/calculate")
        .get("http://localhost:8080/api/yieldcurve/calculate") // kendi apime istek atıyorum
        .then((response) => {
          setYieldToMaturity(response.data.yields);
          setMaturities(response.data.maturities);
          setDataFetched(true); // silinebilir
          //setBusinessDate(response.data.maturityDates[0]);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
      setShouldUpdateGraph(false);
    }
  }, [shouldUpdateGraph]);

  useEffect(() => {
    //https://yield-153eacdc3ce4.herokuapp.com/api/yieldcurve/calculateMaturity
    axios
      //.get("http://localhost:8080/api/yieldcurve/calculate")
      .get("http://localhost:8080/api/yieldcurve/calculateMaturity") // kendi apime istek atıyorum
      .then((response) => {
        setBusinessDate(response.data.maturityDates[0]);
        console.log("apiden gelen veri:", response.data.maturityDates[0]);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (dataFetched) {
      let newSeriesData;

      if (lowTargetYear == null && highTargetYear == null) {
        newSeriesData = maturities.map((maturity, index) => {
          return { x: maturity, y: yieldToMaturity[index] };
        });
      } else {
        const newMaturities = [];
        const newYieldToMaturity = [];
        for (let i = 0; i < maturities.length; i++) {
          if (
            maturities[i] >= lowTargetYear &&
            maturities[i] <= highTargetYear
          ) {
            newMaturities.push(maturities[i]);
            newYieldToMaturity.push(yieldToMaturity[i]);
          }
        }
        newSeriesData = newMaturities.map((maturity, index) => {
          return { x: maturity, y: newYieldToMaturity[index] };
        });
      }

      setSeriesData(newSeriesData);
      setDataFetched(false); // silinebilir
    }
  }, [maturities, yieldToMaturity, lowTargetYear, highTargetYear, dataFetched]);

  console.log("maturities: " + maturities);
  console.log("yieldToMaturity: " + yieldToMaturity);

  /*
  seriesData = maturities.map((maturity, index) => {
    return { x: maturity, y: yieldToMaturity[index] };
  });
  */

  const targetMaturity = moment(targetDate).diff(
    moment(businessDate),
    "years",
    true
  );

  useEffect(() => {
    let interpolatedYield = null;

    for (let i = 0; i < maturities.length - 1; i++) {
      if (
        targetMaturity >= maturities[i] &&
        targetMaturity <= maturities[i + 1]
      ) {
        interpolatedYield = linearSplineInterpolation(
          targetMaturity,
          maturities[i],
          maturities[i + 1],
          yieldToMaturity[i],
          yieldToMaturity[i + 1]
        );
        break;
      }
    }

    setInterpolatedYield(interpolatedYield);
  }, [targetMaturity, maturities, yieldToMaturity]);

  /*
  const handleFileChange = (e) => {
    const fileInput = e.target;
    const fileNameDiv = document.getElementById("fileName");
    if (fileInput.files && fileInput.files.length > 0) {
      fileNameDiv.textContent = fileInput.files[0].name;
    }
  };
  */

  const sendFile = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileContent = event.target.result;
        console.log("fileContent: " + fileContent);

        // Axios ile API'ye POST isteği gönder
        try {
          const response = await axios.post(
            "http://localhost:8080/api/yieldcurve/uploadFile",
            { fileContent },
            {
              contentType: "application/json",
            }
          );
          console.log("Response:", response.data);

          setShouldUpdateGraph(true); // Değişkeni güncelleyin
        } catch (error) {
          console.error("An error occurred:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  const options = {
    chart: {
      // Animation: true,
      height: 680, // Yükseklik 700px olarak ayarlandı
      width: 960, // Genişlik 1000px olarak ayarlandı
      borderRadius: 10, // Kenar yuvarlaklığı 10px olarak ayarland
      backgroundColor: "#EFF8F8", // Arka plan rengi ayarlandı
    },
    title: {
      text: `Yield Curve starting from ${businessDate}`,
    },
    xAxis: {
      title: {
        text: "Maturity (years)",
      },
      //categories: maturities,
    },
    yAxis: {
      title: {
        text: "Yield to Maturity (%)",
      },
      //categories: yieldToMaturity,
    },
    series: [
      {
        name: "Yield Points",
        data: seriesData,
        type: "line",
        color: "#007bff",
        marker: {
          enabled: true,
          radius: 5,
        },
        events: {
          click: function (event) {
            alert(
              `Maturity: ${maturities[event.point.index]}\nYield: ${
                event.point.y
              }`
            );
          },
        },
      },
    ],
  };

  return (
    <div className="yieldcurve">
      <div className="dates">
        <div className="FileSelectandSend">
          <label>Select File: </label>
          <input
            className="fileSelect"
            type="file"
            //onChange={handleFileChange} <div id="fileName"></div>
            id="fileInput"
          />

          <button className="sendButton" onClick={sendFile}>
            Send File
          </button>
        </div>
        <div className="RangeSelectBox">
          <label>Select Range: </label>
          <p> </p>
          <select onChange={handleRangeChange} className="selectBox">
            <option value="">Select Range</option>
            <option value="All">All</option>
            <option value="0-3">0-3</option>
            <option value="3-5">3-5</option>
            <option value="5-10">5-10</option>
            <option value="10-20">10-20</option>
          </select>
          {/* Diğer UI elemanları */}
        </div>
        <div className="businessDateBox">
          <label>Business Date: </label>
          <input
            type="date"
            value={businessDate}
            //onChange={(e) => setBusinessDate(e.target.value)}
            readOnly // businessDate değiştirelemez olarak ayarlandı
          />
        </div>
        <div className="TargetDateBox">
          <label>Target Date: </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div>
          <label>Results: </label>
        </div>
        {renderInterpolatedData()}
      </div>
      <div className="graph">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default YieldCurve;
