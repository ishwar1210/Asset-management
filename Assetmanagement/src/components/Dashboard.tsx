import './Dashboard.css';
import { TrendingUp, Package, Wrench } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useState, useEffect } from 'react';
import { 
  getGRNList, 
  getAssetAllocationList, 
  getAssetDistributionList,
  getAssetList,
  getAssetTaggingList 
} from '../api/endpoint';

function Dashboard() {
  const [totalAssets, setTotalAssets] = useState(0);
  const [allocableCount, setAllocableCount] = useState(0);
  const [distributionCount, setDistributionCount] = useState(0);
  const [stockData, setStockData] = useState<any[]>([]);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [recentAllocations, setRecentAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Data for Monthly Utilization Rate
  const utilizationData = [
    { month: '100', rate: 12 },
    { month: '120', rate: 18 },
    { month: '140', rate: 15 },
    { month: '160', rate: 25 },
    { month: '180', rate: 22 },
    { month: '200', rate: 30 }
  ];

  // Mini chart data for cards
  const miniChartData = [
    { value: 10 },
    { value: 15 },
    { value: 13 },
    { value: 17 },
    { value: 20 },
    { value: 18 },
    { value: 22 }
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch Total Assets from GRN
      const grnResponse = await getGRNList();
      console.log('GRN Response:', grnResponse);
      console.log('GRN Response Type:', typeof grnResponse);
      console.log('Is Array?', Array.isArray(grnResponse));
      
      let grnArray = [];
      if (Array.isArray(grnResponse)) {
        grnArray = grnResponse;
      } else if (grnResponse?.data && Array.isArray(grnResponse.data)) {
        grnArray = grnResponse.data;
      } else if (grnResponse?.result && Array.isArray(grnResponse.result)) {
        grnArray = grnResponse.result;
      }
      
      console.log('GRN Array:', grnArray);
      if (grnArray.length > 0) {
        const totalQty = grnArray.reduce((sum: number, item: any) => {
          // Check for qty, quantity, or lineItems
          let itemQty = 0;
          if (item.qty) {
            itemQty = item.qty;
          } else if (item.quantity) {
            itemQty = item.quantity;
          } else if (item.lineItems && Array.isArray(item.lineItems)) {
            itemQty = item.lineItems.reduce((lineSum: number, line: any) => 
              lineSum + (line.quantity || line.qty || 0), 0);
          }
          console.log('Item:', item, 'Qty:', itemQty);
          return sum + itemQty;
        }, 0);
        console.log('Total Qty:', totalQty);
        setTotalAssets(totalQty);
      }

      // Fetch Allocable count
      const allocationResponse = await getAssetAllocationList();
      console.log('Allocation Response:', allocationResponse);
      let allocationArray = [];
      if (Array.isArray(allocationResponse)) {
        allocationArray = allocationResponse;
        setAllocableCount(allocationResponse.length);
      } else if (allocationResponse?.data && Array.isArray(allocationResponse.data)) {
        allocationArray = allocationResponse.data;
        setAllocableCount(allocationResponse.data.length);
      }
      
      // Fetch RFID Asset Tagging data for serial numbers
      const rfidResponse = await getAssetTaggingList();
      console.log('RFID Tagging Response:', rfidResponse);
      let rfidArray = [];
      if (Array.isArray(rfidResponse)) {
        rfidArray = rfidResponse;
      } else if (rfidResponse?.data && Array.isArray(rfidResponse.data)) {
        rfidArray = rfidResponse.data;
      }
      
      // Create a map of assetTaggingId to serial number
      const serialMap = new Map();
      rfidArray.forEach((item: any) => {
        serialMap.set(item.assetTaggingId, {
          serialNo: item.serialNo || 'N/A',
          rfidNo: item.rfidNo || 'N/A'
        });
      });
      
      // Set recent allocations (last 7)
      if (allocationArray.length > 0) {
        const recentData = allocationArray.slice(0, 7).map((item: any) => {
          const serialData = serialMap.get(item.assetTaggingId) || { serialNo: 'N/A', rfidNo: 'N/A' };
          return {
            employee: item.areaTypeName || item.areaName || item.employeeName || item.userName || 'N/A',
            asset: item.assetName || item.asset || 'N/A',
            serial: serialData.serialNo,
            date: item.allocationDate ? new Date(item.allocationDate).toLocaleDateString() : 
                  item.date ? new Date(item.date).toLocaleDateString() : 'N/A'
          };
        });
        setRecentAllocations(recentData);
      }

      // Fetch Distribution count
      const distributionResponse = await getAssetDistributionList();
      console.log('Distribution Response:', distributionResponse);
      if (Array.isArray(distributionResponse)) {
        setDistributionCount(distributionResponse.length);
      } else if (distributionResponse?.data && Array.isArray(distributionResponse.data)) {
        setDistributionCount(distributionResponse.data.length);
      }

      // Fetch Categories and Assets for Stock Levels
      const assetResponse = await getAssetList();
      console.log('Asset Response:', assetResponse);
      
      let assetArray = [];
      
      if (Array.isArray(assetResponse)) {
        assetArray = assetResponse;
      } else if (assetResponse?.data && Array.isArray(assetResponse.data)) {
        assetArray = assetResponse.data;
      }
      
      console.log('Asset Array:', assetArray);
      
      if (assetArray.length > 0) {
        // Group assets by categoryName and count them
        const categoryMap = new Map<string, number>();
        
        assetArray.forEach((asset: any) => {
          const categoryName = asset.categoryName || asset.category || 'Unknown';
          const currentCount = categoryMap.get(categoryName) || 0;
          categoryMap.set(categoryName, currentCount + 1);
        });
        
        // Convert map to array for chart
        const categoryAssetCount = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name: name,
          value: count
        }));
        
        console.log('Category Asset Count:', categoryAssetCount);
        setStockData(categoryAssetCount);
      }

      // Calculate Allocation Status
      if (assetArray.length > 0) {
        const totalAssetCount = assetArray.length;
        const allocatedCount = allocationArray.length;
        
        const allocatedPercent = totalAssetCount > 0 ? Math.round((allocatedCount / totalAssetCount) * 100) : 0;
        const unallocatedPercent = 100 - allocatedPercent;
        
        setAllocationData([
          { name: 'Assigned', value: allocatedPercent },
          { name: 'Unassigned', value: unallocatedPercent }
        ]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Total Assets</h3>
              <div className="stat-value">{totalAssets.toLocaleString()}</div>
              <div className="stat-subvalue">Assets</div>
            </div>
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={miniChartData}>
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Allocable</h3>
              <div className="stat-value">{allocableCount.toLocaleString()}</div>
              <div className="stat-subvalue">Allocated Assets</div>
            </div>
            <div className="stat-icon orange">
              <Package size={24} />
            </div>
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={miniChartData}>
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-info">
              <h3>Deployment</h3>
              <div className="stat-value">{distributionCount.toLocaleString()}</div>
              <div className="stat-subvalue">Deploy Assets</div>
            </div>
            <div className="stat-icon red">
              <Wrench size={24} />
            </div>
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={miniChartData}>
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card chart-card-wide">
          <h3>Stock Levels by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Allocation Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {allocationData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="allocation-labels">
            <div className="allocation-label">
              <span className="label-dot assigned"></span>
              <span>Assigned</span>
              <strong>{allocationData[0]?.value || 0}%</strong>
            </div>
            <div className="allocation-label">
              <span className="label-dot unassigned"></span>
              <span>Unassigned</span>
              <strong>{allocationData[1]?.value || 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Utilization Rate Row */}
      <div className="charts-row">
        <div className="chart-card chart-card-full">
          <h3>Monthly Utilization Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity and Alerts Row */}
         <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot blue"></span>
              <span className="activity-text">New Software Licenses Added</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot green"></span>
              <span className="activity-text">Server Rack Upgrade Complete</span>
            </div>
          </div>
      </div>

      </div>

      {/* Recent Allocations Table */}
      <div className="table-card">
        <h3>Recent Allocations</h3>
        <table className="allocations-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Asset</th>
              <th>Serial Number</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentAllocations.length > 0 ? (
              recentAllocations.map((allocation, index) => (
                <tr key={index}>
                  <td>{allocation.employee}</td>
                  <td>{allocation.asset}</td>
                  <td>{allocation.serial}</td>
                  <td>{allocation.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No allocations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;