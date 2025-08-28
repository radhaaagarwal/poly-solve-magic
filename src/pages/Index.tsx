import { useState } from "react";
import { DataPointInput, DataPoint } from "@/components/DataPointInput";
import { PolynomialSolver } from "@/components/PolynomialSolver";
import { FunctionEvaluator } from "@/components/FunctionEvaluator";

const Index = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  // Extract coefficients for function evaluator
  const getCoefficients = () => {
    if (dataPoints.length < 3) return { a: 0, b: 0, c: 0 };
    
    const [p1, p2, p3] = dataPoints.slice(0, 3);
    
    try {
      const x1 = p1.x, y1 = p1.y;
      const x2 = p2.x, y2 = p2.y;
      const x3 = p3.x, y3 = p3.y;

      const denominator = x1 * x1 * (x2 - x3) + x2 * x2 * (x3 - x1) + x3 * x3 * (x1 - x2);
      
      if (Math.abs(denominator) < 1e-10) {
        return { a: 0, b: 0, c: 0 };
      }

      const a = (y1 * (x2 - x3) + y2 * (x3 - x1) + y3 * (x1 - x2)) / denominator;
      const b = (x1 * x1 * (y2 - y3) + x2 * x2 * (y3 - y1) + x3 * x3 * (y1 - y2)) / denominator;
      const c = (x1 * x1 * (x2 * y3 - x3 * y2) + x2 * x2 * (x3 * y1 - x1 * y3) + x3 * x3 * (x1 * y2 - x2 * y1)) / denominator;

      return { a, b, c };
    } catch {
      return { a: 0, b: 0, c: 0 };
    }
  };

  const { a, b, c } = getCoefficients();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text">
            Polynomial Solver
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use Lagrange interpolation to find polynomial coefficients from data points.
            Solve for constants a, b, c in the form ax² + bx + c.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <DataPointInput 
              dataPoints={dataPoints}
              onDataPointsChange={setDataPoints}
            />
            
            {dataPoints.length >= 3 && (
              <FunctionEvaluator a={a} b={b} c={c} />
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
