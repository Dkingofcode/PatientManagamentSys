// Updated: InventoryDashboard.tsx with Search, Spinner Below Search & Responsive Design
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { CSVLink } from "react-csv";
import { QRCodeCanvas } from "qrcode.react";
const InventoryDashboard = () => {
    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const notifyAdmin = async (low, avg, ok) => {
        try {
            await axios.post("https:localhost:8000/api/inventory/notify-admin", {
                lowStock: low,
                averageStock: avg,
                okStock: ok,
            });
        }
        catch (err) {
            console.error("Notification error:", err);
        }
    };
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https:localhost:8000/api/inventory");
            setItems(res.data);
            setFiltered(res.data);
            const low = res.data.filter((item) => item.quantity <= item.threshold);
            const avg = res.data.filter((item) => item.quantity > item.threshold && item.quantity <= item.threshold * 2);
            const ok = res.data.filter((item) => item.quantity > item.threshold * 2);
            if (low.length || avg.length || ok.length) {
                await notifyAdmin(low, avg, ok);
            }
        }
        catch (err) {
            console.error("Failed to fetch inventory:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const updateStock = async (id, delta) => {
        setLoading(true);
        try {
            await axios.post("https:localhost:8000/api/inventory/update-stock", {
                id,
                delta,
            });
            await fetchInventory();
        }
        catch (err) {
            console.error("Failed to update stock:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInventory();
    }, []);
    useEffect(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            setFiltered(items);
            return;
        }
        setFiltered(items.filter((i) => {
            const name = i.name?.toLowerCase() || "";
            const category = i.category?.toLowerCase() || "";
            return name.includes(term) || category.includes(term);
        }));
    }, [search, items]);
    return (<Layout title="Inventory Management">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-center sm:text-left">
          Inventory Dashboard
        </h2>
        <CSVLink data={items} filename="inventory_export.csv" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto text-center">
          Export CSV
        </CSVLink>
      </div>

      {/* Search Bar */}
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="mb-4 px-4 py-2 border w-full rounded"/>

      {/* Spinner */}
      {loading && (<div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>)}

      {/* Responsive Table */}
      {!loading && (<div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Item
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Threshold
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Unit
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  QR
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((item) => (<tr key={item.id} className={item.quantity <= item.threshold ? "bg-red-50" : ""}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.threshold}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.unit}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <QRCodeCanvas value={item.name + "-" + item.id} size={48}/>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap space-x-1 sm:space-x-2">
                    <button onClick={() => updateStock(item.id, 1)} className="px-2 py-1 bg-green-500 text-white rounded text-xs sm:text-sm">
                      +1
                    </button>
                    <button onClick={() => updateStock(item.id, -1)} className="px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm">
                      -1
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>)}
    </Layout>);
};
export default InventoryDashboard;
