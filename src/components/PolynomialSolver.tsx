import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPoint } from "./DataPointInput";

interface PolynomialCoefficients {
  a: number;
  b: number;
  c: number;
}

interface PolynomialSolverProps {
  dataPoints: DataPoint[];
}

export const PolynomialSolver = ({ dataPoints }: PolynomialSolverProps) => {
  const coefficients = useMemo(() => {
    if (dataPoints.length < 3) return null;

    // Use first 3 points for quadratic interpolation
    const [p1, p2, p3] = dataPoints.slice(0, 3);
    
    try {
      // Lagrange interpolation for quadratic polynomial
      const lagrangePolynomial = (x: number): number => {
        const l1 = ((x - p2.x) * (x - p3.x)) / ((p1.x - p2.x) * (p1.x - p3.x));
        const l2 = ((x - p1.x) * (x - p3.x)) / ((p2.x - p1.x) * (p2.x - p3.x));
        const l3 = ((x - p1.x) * (x - p2.x)) / ((p3.x - p1.x) * (p3.x - p2.x));
        
        return p1.y * l1 + p2.y * l2 + p3.y * l3;
      };

      // Extract coefficients by evaluating at specific points
      // For f(x) = ax² + bx + c, we need to solve the system:
      // f(x₁) = ax₁² + bx₁ + c = y₁
      // f(x₂) = ax₂² + bx₂ + c = y₂  
      // f(x₃) = ax₃² + bx₃ + c = y₃

      const x1 = p1.x, y1 = p1.y;
      const x2 = p2.x, y2 = p2.y;
      const x3 = p3.x, y3 = p3.y;

      // Using Cramer's rule to solve the linear system
      const denominator = x1 * x1 * (x2 - x3) + x2 * x2 * (x3 - x1) + x3 * x3 * (x1 - x2);
      
      if (Math.abs(denominator) < 1e-10) {
        throw new Error("Points are collinear or too close");
      }

      const a = (y1 * (x2 - x3) + y2 * (x3 - x1) + y3 * (x1 - x2)) / denominator;
      const b = (x1 * x1 * (y2 - y3) + x2 * x2 * (y3 - y1) + x3 * x3 * (y1 - y2)) / denominator;
      const c = (x1 * x1 * (x2 * y3 - x3 * y2) + x2 * x2 * (x3 * y1 - x1 * y3) + x3 * x3 * (x1 * y2 - x2 * y1)) / denominator;

      return { a, b, c, lagrangePolynomial };
    } catch (error) {
      console.error("Error computing polynomial:", error);
      return null;
    }
  }, [dataPoints]);

  const formatNumber = (num: number): string => {
    return Math.abs(num) < 1e-10 ? "0" : num.toFixed(6);
  };

  const formatCoefficient = (coeff: number, variable: string, isFirst: boolean = false): string => {
    if (Math.abs(coeff) < 1e-10) return "";
    
    const sign = coeff >= 0 ? (isFirst ? "" : " + ") : " - ";
    const absCoeff = Math.abs(coeff);
    
    if (variable === "") {
      return `${sign}${formatNumber(absCoeff)}`;
    }
    
    if (Math.abs(absCoeff - 1) < 1e-10) {
      return `${sign}${variable}`;
    }
    
    return `${sign}${formatNumber(absCoeff)}${variable}`;
  };

  if (!coefficients || dataPoints.length < 3) {
    return (
      <Card className="w-full math-glow border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text">Polynomial Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {dataPoints.length === 0 
              ? "Add at least 3 data points to compute the polynomial."
              : `Need ${3 - dataPoints.length} more data point(s) for polynomial interpolation.`
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const { a, b, c } = coefficients;
  
  // Build the polynomial string
  let polynomialStr = "f(x) = ";
  const terms: string[] = [];
  
  if (Math.abs(a) >= 1e-10) terms.push(formatCoefficient(a, "x²", terms.length === 0));
  if (Math.abs(b) >= 1e-10) terms.push(formatCoefficient(b, "x", terms.length === 0));
  if (Math.abs(c) >= 1e-10) terms.push(formatCoefficient(c, "", terms.length === 0));
  
  if (terms.length === 0) {
    polynomialStr += "0";
  } else {
    polynomialStr += terms.join("");
  }

  return (
    <Card className="w-full math-glow border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Polynomial Solution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-math-primary mb-2">Coefficients:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-secondary/30 rounded border border-primary/20">
                <span className="text-sm text-muted-foreground">a =</span>
                <div className="math-equation text-lg text-math-success">{formatNumber(a)}</div>
              </div>
              <div className="p-3 bg-secondary/30 rounded border border-primary/20">
                <span className="text-sm text-muted-foreground">b =</span>
                <div className="math-equation text-lg text-math-warning">{formatNumber(b)}</div>
              </div>
              <div className="p-3 bg-secondary/30 rounded border border-primary/20">
                <span className="text-sm text-muted-foreground">c =</span>
                <div className="math-equation text-lg text-math-secondary">{formatNumber(c)}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-math-primary mb-2">Polynomial Equation:</h3>
            <div className="p-4 bg-secondary/30 rounded border border-primary/20">
              <div className="math-equation text-xl text-center gradient-text">
                {polynomialStr}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-math-secondary mb-2">C</div>
            <div className="math-equation text-lg">
              Constant term: <span className="text-math-secondary">{formatNumber(c)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};