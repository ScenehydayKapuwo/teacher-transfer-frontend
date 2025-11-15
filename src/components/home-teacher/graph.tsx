import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchStats } from "../../api/stat/stats";
import router from "next/router";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const HomeGraph = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetchStats(token)
      .then((res) => {
        const normalized = res.transferByMonth.map((month: any) => ({
          month: month.month.toLowerCase(),
          pending: month.Pending || month.pending || 0,
          approved: month.Approved || month.approved || 0,
          rejected: month.Rejected || month.rejected || 0,
        }));

        console.log("Data sent to chart:", normalized);
        setData(normalized);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
      });
  }, []);

  const renderLegendIcon = (value: string) => {
    switch (value) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-800/60 px-3 py-1 rounded-full text-gray-200 font-medium shadow-sm hover:bg-gray-700/80 transition"
          >
            {renderLegendIcon(entry.value)}
            <span className="capitalize">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const allZero = data.every(
    (month) =>
      month.pending === 0 && month.approved === 0 && month.rejected === 0
  );

  return (
    <div className="w-full p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800 transition hover:shadow-xl hover:shadow-gray-800/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Teacher Transfers by Month
        </h2>
        <span className="text-sm text-gray-400 italic">
          Updated automatically
        </span>
      </div>

      <div className="border-t border-gray-700 mb-6" />

      {allZero ? (
        <div className="flex flex-col items-center justify-center h-[18rem]">
          <XCircle className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-gray-400 text-center text-lg">
            No transfer data available
          </p>
        </div>
      ) : (
        <div className="w-full h-[24rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="month"
                stroke="#fff"
                tickLine={false}
                style={{ fontSize: "0.85rem" }}
              />
              <YAxis stroke="#fff" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend content={renderCustomLegend} />
              <Bar dataKey="pending" fill="#d4aa1e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="approved" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="rejected" fill="#b91c1c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HomeGraph;
