import { useState } from "react";
import { DataPointInput, DataPoint } from "@/components/DataPointInput";
import { PolynomialSolver } from "@/components/PolynomialSolver";
import { FunctionEvaluator } from "@/components/FunctionEvaluator";

const Index = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  // Extract coefficients for function evaluator
  const getCoefficients = () => {
    if (dataPoints.length < 2) return { coefficients: [], degree: 0 };
    
    try {
      const n = dataPoints.length;
      const points = [...dataPoints];
      
      // Initialize coefficients array
      const coeffs: number[] = new Array(n).fill(0);
      
      // Lagrange interpolation
      for (let i = 0; i < n; i++) {
        const basis: number[] = new Array(n).fill(0);
        basis[n - 1] = 1;
        
        let denominator = 1;
        
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            denominator *= (points[i].x - points[j].x);
            
            for (let k = 0; k < n - 1; k++) {
              basis[k] += basis[k + 1] * (-points[j].x);
            }
          }
        }
        
        for (let k = 0; k < n; k++) {
          coeffs[k] += (points[i].y * basis[k]) / denominator;
        }
      }
      
      return { coefficients: coeffs, degree: n - 1 };
    } catch {
      return { coefficients: [], degree: 0 };
    }
  };

  const { coefficients, degree } = getCoefficients();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text">
            Polynomial Solver
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use Lagrange interpolation to find polynomial coefficients from data points.
            Supports polynomials of any degree - add n points for degree n-1 polynomial.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <DataPointInput 
              dataPoints={dataPoints}
              onDataPointsChange={setDataPoints}
            />
            
            {dataPoints.length >= 2 && (
              <FunctionEvaluator coefficients={coefficients} degree={degree} />
            )}
          </div>

          <div>
            <PolynomialSolver dataPoints={dataPoints} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
