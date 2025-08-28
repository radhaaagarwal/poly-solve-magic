import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPoint } from "./DataPointInput";

interface PolynomialCoefficients {
  coefficients: number[];
  degree: number;
}

interface PolynomialSolverProps {
  dataPoints: DataPoint[];
}

export const PolynomialSolver = ({ dataPoints }: PolynomialSolverProps) => {
  const coefficients = useMemo(() => {
    if (dataPoints.length < 2) return null;

    try {
      // C++ equivalent algorithm:
      /*
      #include <vector>
      #include <cmath>
      
      std::vector<double> lagrangeInterpolation(const std::vector<std::pair<double, double>>& points) {
          int n = points.size();
          std::vector<double> coeffs(n, 0.0);
          
          for (int i = 0; i < n; i++) {
              std::vector<double> basis(n, 0.0);
              basis[n-1] = 1.0; // Start with polynomial 1
              
              double denominator = 1.0;
              for (int j = 0; j < n; j++) {
                  if (i != j) {
                      denominator *= (points[i].first - points[j].first);
                      
                      // Multiply basis by (x - points[j].first)
                      for (int k = 0; k < n-1; k++) {
                          basis[k] += basis[k+1] * (-points[j].first);
                      }
                  }
              }
              
              // Add contribution to final coefficients
              for (int k = 0; k < n; k++) {
                  coeffs[k] += (points[i].second * basis[k]) / denominator;
              }
          }
          return coeffs;
      }
      */
      
      const n = dataPoints.length;
      const points = [...dataPoints]; // Copy for stability
      
      // Initialize coefficients array (degree n-1 polynomial has n coefficients)
      const coeffs: number[] = new Array(n).fill(0);
      
      // Lagrange interpolation - compute each basis polynomial
      for (let i = 0; i < n; i++) {
        // Compute Lagrange basis polynomial Li(x)
        const basis: number[] = new Array(n).fill(0);
        basis[n - 1] = 1; // Start with polynomial "1"
        
        let denominator = 1;
        
        // Build basis polynomial and denominator
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            denominator *= (points[i].x - points[j].x);
            
            // Multiply current basis by (x - points[j].x)
            for (let k = 0; k < n - 1; k++) {
              basis[k] += basis[k + 1] * (-points[j].x);
            }
          }
        }
        
        // Add weighted contribution to final coefficients
        for (let k = 0; k < n; k++) {
          coeffs[k] += (points[i].y * basis[k]) / denominator;
        }
      }
      
      return {
        coefficients: coeffs,
        degree: n - 1,
        lagrangePolynomial: (x: number): number => {
          let result = 0;
          for (let i = 0; i < n; i++) {
            result += coeffs[i] * Math.pow(x, i);
          }
          return result;
        }
      };
    } catch (error) {
      console.error("Error computing polynomial:", error);
      return null;
    }
  }, [dataPoints]);

  const formatNumber = (num: number): string => {
    return Math.abs(num) < 1e-10 ? "0" : num.toFixed(6);
  };

  const formatCoefficient = (coeff: number, power: number, isFirst: boolean = false): string => {
    if (Math.abs(coeff) < 1e-10) return "";
    
    const sign = coeff >= 0 ? (isFirst ? "" : " + ") : " - ";
    const absCoeff = Math.abs(coeff);
    
    if (power === 0) {
      return `${sign}${formatNumber(absCoeff)}`;
    } else if (power === 1) {
      if (Math.abs(absCoeff - 1) < 1e-10) {
        return `${sign}x`;
      }
      return `${sign}${formatNumber(absCoeff)}x`;
    } else {
      if (Math.abs(absCoeff - 1) < 1e-10) {
        return `${sign}x^${power}`;
      }
      return `${sign}${formatNumber(absCoeff)}x^${power}`;
    }
  };

  if (!coefficients || dataPoints.length < 2) {
    return (
      <Card className="w-full math-glow border-primary/20">
        <CardHeader>
          <CardTitle className="gradient-text">Polynomial Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {dataPoints.length === 0 
              ? "Add at least 2 data points to compute the polynomial."
              : `Need ${2 - dataPoints.length} more data point(s) for polynomial interpolation.`
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const { coefficients: coeffs, degree } = coefficients;
  
  // Build the polynomial string (display in standard form: highest degree first)
  let polynomialStr = "f(x) = ";
  const terms: string[] = [];
  
  for (let i = degree; i >= 0; i--) {
    if (Math.abs(coeffs[i]) >= 1e-10) {
      terms.push(formatCoefficient(coeffs[i], i, terms.length === 0));
    }
  }
  
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
            <h3 className="text-lg font-semibold text-math-primary mb-2">
              Coefficients (Degree {degree} Polynomial):
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {coeffs.map((coeff, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded border border-primary/20">
                  <span className="text-sm text-muted-foreground">
                    {index === 0 ? "c₀ =" : `c₍${index}₎ =`}
                  </span>
                  <div className="math-equation text-sm">
                    {formatNumber(coeff)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {index === 0 ? "constant" : index === 1 ? "x¹" : `x^${index}`}
                  </div>
                </div>
              ))}
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
              Constant term: <span className="text-math-secondary">{formatNumber(coeffs[0])}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};