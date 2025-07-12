import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WeightTracker() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
  const [yourWeight, setYourWeight] = useState(0);
  const [jesseWeight, setJesseWeight] = useState(0);
  const [yourGoal, setYourGoal] = useState(null);
  const [jesseGoal, setJesseGoal] = useState(null);
  const [yourHeight, setYourHeight] = useState(70); // inches
  const [jesseHeight, setJesseHeight] = useState(68); // inches

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('weightData');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('weightData', JSON.stringify(data));
  }, [data]);

  const calculateBMI = (weight, height) => {
    return height ? (703 * weight) / (height * height) : 0;
  };

  const addEntry = () => {
    if (!date) return;
    const week = data.length + 1;
    const prevYourWeight = data[data.length - 1]?.yourWeight || yourWeight;
    const prevJesseWeight = data[data.length - 1]?.jesseWeight || jesseWeight;
    setData([...data, {
      week,
      date: date.toLocaleDateString(),
      yourWeight,
      yourChange: yourWeight - prevYourWeight,
      yourBMI: calculateBMI(yourWeight, yourHeight),
      jesseWeight,
      jesseChange: jesseWeight - prevJesseWeight,
      jesseBMI: calculateBMI(jesseWeight, jesseHeight)
    }]);
  };

  const exportCSV = () => {
    const csvContent = [
      ['Week', 'Date', 'Your Weight', 'Your Change', 'Your BMI', "Jesse's Weight", "Jesse's Change", "Jesse's BMI"],
      ...data.map(d => [d.week, d.date, d.yourWeight, d.yourChange, d.yourBMI.toFixed(1), d.jesseWeight, d.jesseChange, d.jesseBMI.toFixed(1)])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weight_data.csv';
    a.click();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">🏋️‍♂️ Training Buddies Weight Tracker 🏋️‍♂️</h1>
      <p className="text-center mb-4 text-sm">You & Jesse's Fitness Journey • Started {new Date().toLocaleDateString()}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <Label>Your Goal Weight (lbs)</Label>
            <Input type="number" onChange={e => setYourGoal(Number(e.target.value))} />
            <Label className="mt-2">Your Height (in)</Label>
            <Input type="number" value={yourHeight} onChange={e => setYourHeight(Number(e.target.value))} />
            <Label className="mt-2">Jesse's Goal Weight (lbs)</Label>
            <Input type="number" onChange={e => setJesseGoal(Number(e.target.value))} />
            <Label className="mt-2">Jesse's Height (in)</Label>
            <Input type="number" value={jesseHeight} onChange={e => setJesseHeight(Number(e.target.value))} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label>Date</Label>
            <Calendar selected={date} onSelect={setDate} />
            <Label className="mt-2">Your Weight (lbs)</Label>
            <Input type="number" value={yourWeight} onChange={e => setYourWeight(Number(e.target.value))} />
            <Label className="mt-2">Jesse's Weight (lbs)</Label>
            <Input type="number" value={jesseWeight} onChange={e => setJesseWeight(Number(e.target.value))} />
            <Button className="mt-2 w-full" onClick={addEntry}>Add Entry</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-2">Week</th>
                <th className="p-2">Date</th>
                <th className="p-2">Your Weight</th>
                <th className="p-2">Change</th>
                <th className="p-2">Your BMI</th>
                <th className="p-2">Jesse's Weight</th>
                <th className="p-2">Change</th>
                <th className="p-2">Jesse's BMI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{entry.week}</td>
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">{entry.yourWeight}</td>
                  <td className="p-2">{entry.yourChange.toFixed(1)}</td>
                  <td className="p-2">{entry.yourBMI.toFixed(1)}</td>
                  <td className="p-2">{entry.jesseWeight}</td>
                  <td className="p-2">{entry.jesseChange.toFixed(1)}</td>
                  <td className="p-2">{entry.jesseBMI.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-2">📊 Progress Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="yourWeight" name="Jose's Weight" fill="#8884d8" />
          <Bar dataKey="jesseWeight" name="Jesse's Weight" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
