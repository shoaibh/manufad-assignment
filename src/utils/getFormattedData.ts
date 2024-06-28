import Data from "../data/Dataset.json";

/*
    The dataset in the json file is in this format

    [
        {
            "Country": "India",
            "Year": "Financial Year (Apr - Mar), 1950",
            "Crop Name": "CoarseCereals",
            "Crop Production (UOM:t(Tonnes))": 154,
            "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": 408,
            "Area Under Cultivation (UOM:Ha(Hectares))": 377
        },
        ...
    ]
    
    to perform analytics, we need to change the structure of this dataset.
    For the year wise data, this function first converts it into this format while calculating 
    the values as well.

    yearWiseData = {
        year: {
            max: [{
                cropName,
                cropProd
            }],
            min: [{
                cropName,
                cropProd
            }]
        }
    }
    
    this way, we have the maximum and minimum production for that year. 
    The min and max are arrays because there can be multiple crops with same production.

    Similarly, crop-wise data is calculated and a structure like this is made.

    cropWiseData = {
        cropName: {
            yieldCount,
            sumYield,
            cultivationCount,
            cultivationSum,
        }
    }
    
   This calculation has a time complexity of O(N) since the data is looped only once.
   
   After this, formattedYearWiseData is created with the yearWiseData which has a 
   structure of 

   formattedYearWiseData = [[year, max production crop names, min production crop names], [...], ...]

   This structure is really useful as it can be passed to the table component directly.

   Similarly, 

   formattedCropWiseData = [[crop name, average yield, average cultivation], [...], ...]

*/

type CropProdData = {
  cropName: string;
  cropProd: number;
};

type YearWiseCropDataType = {
  max: Array<CropProdData>;
  min: Array<CropProdData>;
};

type CropWiseData = {
  yieldCount: number;
  sumYield: number;
  cultivationCount: number;
  cultivationSum: number;
};

export const getFormattedData = () => {
  let yearWiseData = new Map<string, YearWiseCropDataType>();
  let cropWiseData = new Map<string, CropWiseData>();

  // updates the yearWiseData Map to the YearWiseCropDataType structure
  const updateYearWiseData = (year: string, cropName: string, cropProd: number) => {
    if (yearWiseData.has(year)) {
      const yearData = yearWiseData.get(year)!;

      if (yearData.max[0].cropProd === cropProd) {
        yearData.max.push({ cropName, cropProd });
      } else if (yearData.max[0].cropProd < cropProd) {
        yearData.max = [{ cropName, cropProd }];
      }

      if (yearData.min[0].cropProd === cropProd) {
        yearData.min.push({ cropName, cropProd });
      } else if (yearData.min[0].cropProd > cropProd) {
        yearData.min = [{ cropName, cropProd }];
      }
    } else {
      yearWiseData.set(year, {
        max: [{ cropName, cropProd }],
        min: [{ cropName, cropProd }],
      });
    }
  };

  // updates the cropWiseData Map to the CropWiseData structure
  const updateCropWiseData = (cropName: string, cropYield: number, cultivation: number) => {
    if (cropWiseData.has(cropName)) {
      const cropData = cropWiseData.get(cropName)!;

      const sumYield = cropData.sumYield + cropYield;
      const yieldCount = cropData.yieldCount + 1;

      const cultivationSum = cropData.cultivationSum + cultivation;
      const cultivationCount = cropData.cultivationCount + 1;

      cropWiseData.set(cropName, {
        sumYield,
        cultivationSum,
        yieldCount,
        cultivationCount,
      });
    } else {
      cropWiseData.set(cropName, {
        sumYield: cropYield,
        cultivationSum: cultivation,
        yieldCount: 1,
        cultivationCount: 1,
      });
    }
  };

  for (const d of Data) {
    const year = d.Year;
    const cropName = d["Crop Name"];
    const cropProd = Number(d["Crop Production (UOM:t(Tonnes))"]);
    const cropYield = Number(d["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]);
    const cultivation = Number(d["Area Under Cultivation (UOM:Ha(Hectares))"]);

    updateYearWiseData(year, cropName, cropProd);
    updateCropWiseData(cropName, cropYield, cultivation);
  }

  const formattedYearWiseData: string[][] = Array.from(yearWiseData.entries()).map(([year, { max, min }]) => {
    // gets the 4 digit year in number from the string
    const yearInNumber = year.match(/(\d{4})/)![0];

    return [yearInNumber, max.map((m) => m.cropName).join(", "), min.map((m) => m.cropName).join(", ")];
  });

  const formattedCropWiseData: string[][] = Array.from(cropWiseData.entries()).map(
    ([crop, { cultivationSum, sumYield, yieldCount, cultivationCount }]) => {
      const avgYield = sumYield / yieldCount;
      const avgCultivation = cultivationSum / cultivationCount;

      return [crop, avgYield.toFixed(3), avgCultivation.toFixed(3)];
    },
  );

  return {
    yearWiseData: formattedYearWiseData,
    cropWiseData: formattedCropWiseData,
  };
};
