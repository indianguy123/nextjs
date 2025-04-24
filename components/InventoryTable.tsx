"use client";

import React, { useEffect, useState, useId } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchInventory,
  selectFilteredSortedPaginatedData,
  setPage,
  setFilter,
  setSort,
} from "@/store/inventorySlice";

export default function InventoryTable() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectFilteredSortedPaginatedData);
  const page = useAppSelector((state) => state.inventory.page);
  const sort = useAppSelector((state) => state.inventory.sort);
  const [searchQuery, setSearchQuery] = useState("");
  const uniqueId = useId();

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilter({ key: "component_name", value: searchQuery }));
  }, [searchQuery, dispatch]);

  const handleSort = (key: string) => {
    const direction =
      sort.key === key && sort.direction === "asc" ? "desc" : "asc";
    dispatch(setSort({ key, direction }));
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Inventory Data</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by component name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full max-w-md"
      />

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 border">Component ID</th>
            <th className="p-2 border">Component Name</th>
            <th className="p-2 border">Type</th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("usable_quantity")}
            >
              Usable Qty{" "}
              {sort.key === "usable_quantity" &&
                (sort.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("damaged_quantity")}
            >
              Damaged Qty{" "}
              {sort.key === "damaged_quantity" &&
                (sort.direction === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="p-2 border cursor-pointer"
              onClick={() => handleSort("total_quantity")}
            >
              Total Qty{" "}
              {sort.key === "total_quantity" &&
                (sort.direction === "asc" ? "▲" : "▼")}
            </th>
            <th className="p-2 border">Alert</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((parent, parentIndex) => (
            <React.Fragment key={`${uniqueId}-parent-${parentIndex}`}>
              <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
                <td className="p-2 border">{parent.component_id}</td>
                <td className="p-2 border">{parent.component_name}</td>
                <td className="p-2 border">Main</td>
                <td className="p-2 border" colSpan={4}>
                  —
                </td>
                <td className="p-2 border"></td>
              </tr>

              {parent?.subcomponents?.map((sub: any, subIndex: number) => {
                const usable = sub.usable_quantity;
                const alertStatus =
                  usable === 0
                    ? "Out of Stock"
                    : usable < 10
                    ? "Low Stock"
                    : "In Stock";

                return (
                  <tr
                    key={`${uniqueId}-sub-${parentIndex}-${subIndex}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-2 border pl-6">{sub.component_id}</td>
                    <td className="p-2 border">{sub.component_name}</td>
                    <td className="p-2 border">Sub</td>
                    <td className="p-2 border">{sub.usable_quantity}</td>
                    <td className="p-2 border">{sub.damaged_quantity}</td>
                    <td className="p-2 border">{sub.total_quantity}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          alertStatus === "Out of Stock"
                            ? "bg-red-100 text-red-800"
                            : alertStatus === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alertStatus}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => alert("STO Raised")}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Raise an STO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-end items-center space-x-2">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
