import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface FunctionEvaluatorProps {
  coefficients: number[];
  degree: number;
}

export const FunctionEvaluator = ({ coefficients, degree }: FunctionEvaluatorProps) => {
  const [inputX, setInputX] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const evaluateFunction = () => {
    const x = parseFloat(inputX);
    if (!isNaN(x)) {
      // C++ equivalent: double evaluatePolynomial(const std::vector<double>& coeffs, double x)
      let fx = 0;
      for (let i = 0; i < coefficients.length; i++) {
        fx += coefficients[i] * Math.pow(x, i);
      }
      setResult(fx);
    }
  };

  const formatNumber = (num: number): string => {
    return Math.abs(num) < 1e-10 ? "0" : num.toFixed(6);
  };

  const formatPolynomial = (): string => {
    if (coefficients.length === 0) return "f(x) = 0";
    
    const terms: string[] = [];
    for (let i = degree; i >= 0; i--) {
      const coeff = coefficients[i];
      if (Math.abs(coeff) >= 1e-10) {
        const sign = coeff >= 0 ? (terms.length === 0 ? "" : " + ") : " - ";
        const absCoeff = Math.abs(coeff);
        
        if (i === 0) {
          terms.push(`${sign}${formatNumber(absCoeff)}`);
        } else if (i === 1) {
          if (Math.abs(absCoeff - 1) < 1e-10) {
            terms.push(`${sign}x`);
          } else {
            terms.push(`${sign}${formatNumber(absCoeff)}x`);
          }
        } else {
          if (Math.abs(absCoeff - 1) < 1e-10) {
            terms.push(`${sign}x^${i}`);
          } else {
            terms.push(`${sign}${formatNumber(absCoeff)}x^${i}`);
          }
        }
      }
    }
    
    return terms.length === 0 ? "f(x) = 0" : `f(x) = ${terms.join("")}`;
  };

  return (
    <Card className="w-full math-glow border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Function Evaluator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center math-equation text-lg text-muted-foreground">
          {formatPolynomial()}
        </div>
        
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter x value"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            className="bg-secondary/50 border-primary/30"
            onKeyPress={(e) => e.key === 'Enter' && evaluateFunction()}
          />
          <Button 
            onClick={evaluateFunction}
            className="bg-math-primary hover:bg-math-primary/80"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Compute
          </Button>
        </div>

        {result !== null && (
          <div className="p-4 bg-secondary/30 rounded border border-primary/20">
            <div className="text-center">
              <span className="math-equation text-lg">
                f({inputX}) = <span className="text-math-success text-xl font-bold">{formatNumber(result)}</span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};