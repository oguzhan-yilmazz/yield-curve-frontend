import "./YieldCurveHightchart.css";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import axios from "axios";

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
  const [businessDate, setBusinessDate] = useState("2000-01-01");
  const [targetDate, setTargetDate] = useState("2000-06-01");
  const [interpolatedYield, setInterpolatedYield] = useState(null);
  const [maturities, setMaturities] = useState([]);
  const [yieldToMaturity, setYieldToMaturity] = useState([]);

  useEffect(() => {
    axios
      //.get("http://localhost:8080/api/yieldcurve/calculate")
      .get("https://yield-153eacdc3ce4.herokuapp.com/api/yieldcurve/calculate") // kendi apime istek atıyorum
      .then((response) => {
        setMaturities(response.data.maturities);

        setYieldToMaturity(response.data.yields);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  console.log("maturities: " + maturities);
  console.log("yieldToMaturity: " + yieldToMaturity);

  const seriesData = maturities.map((maturity, index) => {
    return { x: maturity, y: yieldToMaturity[index] };
  });

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

  const options = {
    chart: {
      height: 680, // Yükseklik 700px olarak ayarlandı
      width: 860, // Genişlik 1000px olarak ayarlandı
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
      categories: maturities,
    },
    yAxis: {
      title: {
        text: "Yield to Maturity (%)",
      },
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
        <div>
          <label>Business Date: </label>
          <input
            type="date"
            value={businessDate}
            onChange={(e) => setBusinessDate(e.target.value)}
          />
        </div>
        <div>
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
        {
          targetMaturity >
            yieldToMaturity[yieldToMaturity.length - 1](
              <div className="interpolatedData">
                <strong>Aralığın dışında bir değer girdiniz!</strong>
              </div>
            ) // targetMaturity, yieldToMaturity[yieldToMaturity.length-1]'den büyükse
        }
        {interpolatedYield !== null && (
          <div className="interpolatedData">
            <strong>
              Interpolated Yield for Target Date: {interpolatedYield.toFixed(2)}{" "}
              %<h1> </h1>
              Maturity : {targetMaturity} years.hi
            </strong>
          </div>
        )}
      </div>
      <div className="graph">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default YieldCurve;
