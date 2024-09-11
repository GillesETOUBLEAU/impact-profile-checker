import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const QuestionSlider = ({ question, value, onChange }) => {
  return (
    <div className="space-y-4">
      <Label>{question}</Label>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
      <div className="flex justify-between text-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <span key={num}>{num}</span>
        ))}
      </div>
    </div>
  );
};

export default QuestionSlider;