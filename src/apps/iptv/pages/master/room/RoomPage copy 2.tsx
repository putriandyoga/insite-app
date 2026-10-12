// // // import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
// // // import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
// // // import ActionButton from "@/components/ActionButton";
// // // import Breadcrumb from "@/components/Breadcrumb";
// // // import Card from "@/components/Card";
// // // import DataSection from "@/components/DataSection";
// // // import Pagination from "@/components/Pagination";
// // // import TableBase from "@/components/TableBase";
// // // import { useTableFilters } from "@/hooks/use-table-filters";
// // // import { PenBox, Pencil, RotateCcw, Trash } from "lucide-react";
// // // import FormInput from "@/components/FormInput";
// // // import { useWardList } from "@/apps/iptv/hooks/master/ward/use-ward-list";

// // // const RoomPage = () => {
// // //   const {
// // //     page,
// // //     setPage,
// // //     searchTitle,
// // //     filters,
// // //     activeFilters,
// // //     handleFilterChange,
// // //     handleSearchChange,
// // //     resetFilters,
// // //   } = useTableFilters(
// // //     {
// // //       status: "",
// // //       ward_id: "",
// // //     },
// // //     {
// // //       searchKey: "title",
// // //       storeKey: "room-management-page",
// // //     },
// // //   );

// // //   const { data, loading, error, total, lastPage, perPage, isFetching } =
// // //     useRoomList(page, activeFilters);

// // //   const { data: wardList, loading: loadingWards } = useWardList(
// // //     1,
// // //     undefined,
// // //     1000,
// // //   );

// // //   const { handleDelete } = useRoomDelete();

// // //   const isFilterActive = Boolean(
// // //     searchTitle || filters.status || filters.ward_id,
// // //   );

// // //   return (
// // //     /*
// // //       1. Kunci tinggi halaman penuh (h-full) dan overflow-hidden agar
// // //          halaman luar tidak ikut scroll.
// // //     */
// // //     <div className="flex flex-col h-full gap-3 max-w-full overflow-hidden">
// // //       {/* 2. BREADCRUMB DI ATAS (Fixed / Tidak ikut scroll) */}
// // //       <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 shrink-0 w-full">
// // //         <div className="overflow-x-auto py-1">
// // //           <Breadcrumb
// // //             items={[
// // //               { label: "Home", path: "/" },
// // //               { label: "Dashboard", path: "/app/iptv/dashboard" },
// // //               { label: "Room" },
// // //             ]}
// // //           />
// // //         </div>

// // //         <div className="shrink-0">
// // //           <ActionButton
// // //             to="/app/iptv/room/create"
// // //             icon={PenBox}
// // //             label="Tambah Ruangan"
// // //             color="primary"
// // //           />
// // //         </div>
// // //       </div>

// // //       {/*
// // //         3. BAGIAN TENGAH YANG BISA DISCROLL
// // //            (Mencakup Filter, Indikator Total, dan Kartu Tabel sekaligus)
// // //       */}
// // //       <Card className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
// // //         {/* Bagian Filter & Pencarian (Ikut terscroll di dalam area tengah) */}
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm items-end">
// // //           <FormInput
// // //             label="Ruang Perawatan"
// // //             value={filters.ward_id}
// // //             onChange={(val) => handleFilterChange("ward_id", val)}
// // //             options={
// // //               Array.isArray(wardList)
// // //                 ? wardList.map((item) => ({
// // //                     label: item.name,
// // //                     value: item.id,
// // //                   }))
// // //                 : []
// // //             }
// // //             dropdownType="select"
// // //             placeholder="Semua Ward"
// // //             className="w-full"
// // //             disabled={loadingWards}
// // //           />
// // //           <FormInput
// // //             label="Cari Ruangan"
// // //             value={searchTitle}
// // //             onChange={(val) => handleSearchChange(val)}
// // //             placeholder="Ketik label ruangan..."
// // //           />
// // //           <FormInput
// // //             label="Status"
// // //             value={filters.status}
// // //             onChange={(val) => handleFilterChange("status", val)}
// // //             options={[
// // //               { label: "Aktif", value: "ACTIVE" },
// // //               { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
// // //             ]}
// // //             dropdownType="select"
// // //             placeholder="Semua Status"
// // //             className="w-full"
// // //             searchable={false}
// // //           />
// // //           {isFilterActive && (
// // //             <ActionButton
// // //               label="Reset Filter"
// // //               onClick={resetFilters}
// // //               color="warning"
// // //               className="w-full h-11.5"
// // //               icon={RotateCcw}
// // //             />
// // //           )}
// // //         </div>

// // //         {/* Indikator isFetching & Total */}
// // //         <div className="flex items-center justify-between px-1 shrink-0">
// // //           <div className="flex items-center gap-2">
// // //             {isFetching && (
// // //               <div className="flex items-center gap-2 text-primary text-sm animate-pulse">
// // //                 <span className="loading loading-spinner loading-xs"></span>
// // //                 <span>Memperbarui data...</span>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {total !== undefined && (
// // //             <div className="text-data text-base-content/70">
// // //               Total:{" "}
// // //               <span className="font-bold text-base-content">{total}</span> room
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Kartu Kontainer Tabel */}
// // //         <div className="flex flex-col">
// // //           <div className="w-full overflow-x-auto relative rounded-xl border border-base-200">
// // //             <DataSection
// // //               loading={loading}
// // //               error={error}
// // //               data={data}
// // //               emptyMessage="Belum Ada Data Ruangan"
// // //             />

// // //             {!loading && !error && data.length > 0 && (
// // //               <TableBase
// // //                 columns={[
// // //                   {
// // //                     header: "No",
// // //                     render: (_, index) => (page - 1) * perPage + index + 1,
// // //                     className: "text-center w-12",
// // //                   },
// // //                   {
// // //                     header: "Ruang Perawatan",
// // //                     accessor: "ward_name",
// // //                     className: "max-w-xs",
// // //                   },
// // //                   {
// // //                     header: "Label",
// // //                     accessor: "label",
// // //                     className: "text-center",
// // //                   },
// // //                   {
// // //                     header: "Status",
// // //                     render: (row) => (
// // //                       <span
// // //                         className={`badge ${
// // //                           row.archived ? "badge-error" : "badge-primary"
// // //                         } badge-sm`}
// // //                       >
// // //                         {row.archived ? "Arsip" : "Aktif"}
// // //                       </span>
// // //                     ),
// // //                     className: "text-center",
// // //                   },
// // //                   {
// // //                     header: "Aksi",

// // //                     render: (row) => (
// // //                       <div className="inline-flex justify-center gap-2">
// // //                         <ActionButton
// // //                           to={`/iptv/room/${row.id}/edit`}
// // //                           icon={Pencil}
// // //                           color="warning"
// // //                           tooltip="Edit Data"
// // //                         />

// // //                         <ActionButton
// // //                           onClick={() => handleDelete(row.id)}
// // //                           icon={Trash}
// // //                           color="error"
// // //                           tooltip="Hapus Data"
// // //                         />
// // //                       </div>
// // //                     ),

// // //                     className: "text-center",
// // //                   },
// // //                 ]}
// // //                 data={data}
// // //               />
// // //             )}
// // //           </div>
// // //         </div>
// // //       </Card>
// // //       <Pagination
// // //         page={page}
// // //         lastPage={lastPage}
// // //         perPage={perPage}
// // //         total={total}
// // //         onPageChange={(newPage) => setPage(newPage)}
// // //       />

// // //       {/* 4. PAGINATION DI BAWAH (Fixed / Menempel rapi di paling bawah) */}
// // //     </div>
// // //   );
// // // };

// // // export default RoomPage;

// // import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
// // import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
// // import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
// // import ActionButton from "@/components/ActionButton";
// // import Breadcrumb from "@/components/Breadcrumb";
// // import Card from "@/components/Card";
// // import DataSection from "@/components/DataSection";
// // import FormInput from "@/components/FormInput";
// // import Pagination from "@/components/Pagination";
// // import TableBase from "@/components/TableBase";
// // import { useTableFilters } from "@/hooks/use-table-filters";
// // import { PenBox, Pencil, RotateCcw, Trash } from "lucide-react";

// // const RoomPage = () => {
// //   const {
// //     page,
// //     setPage,
// //     searchTitle,
// //     filters,
// //     activeFilters,
// //     handleFilterChange,
// //     handleSearchChange,
// //     resetFilters,
// //   } = useTableFilters(
// //     {
// //       status: "",
// //       ward_id: "",
// //     },
// //     {
// //       searchKey: "title",
// //       storeKey: "room-management-page",
// //     },
// //   );

// //   const { data, loading, error, total, lastPage, perPage, isFetching } =
// //     useRoomList(page, activeFilters);

// //   const { data: wardList, loading: loadingWards } = useWardList(
// //     1,
// //     undefined,
// //     1000,
// //   );

// //   const { handleDelete } = useRoomDelete();

// //   const isFilterActive = Boolean(
// //     searchTitle || filters.status || filters.ward_id,
// //   );

// //   return (
// //     <>
// //       <div className="relative flex h-full min-h-0 max-w-full flex-col gap-3 overflow-hidden">
// //         {/* HEADER HALAMAN */}
// // <div className="relative z-50 flex w-full shrink-0 items-center justify-between gap-2 sm:gap-4">
// //   <div className="min-w-0 overflow-x-auto py-1">
// //     <Breadcrumb
// //       items={[
// //         { label: "Home", path: "/" },
// //         { label: "Dashboard", path: "/app/iptv/dashboard" },
// //         { label: "Room" },
// //       ]}
// //     />
// //   </div>

// //   <div className="shrink-0">
// //     <ActionButton
// //       to="/app/iptv/room/create"
// //       icon={PenBox}
// //       label="Tambah Ruangan"
// //       color="primary"
// //     />
// //   </div>
// // </div>

// //         {/* AREA SCROLL */}
// //         <Card className="min-h-0 flex-1 overflow-auto">
// //           <div className="flex min-w-0 flex-col gap-4">
// //             {/* FILTER: ikut scroll */}
// //             <div className="grid grid-cols-1 items-end gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
// //               <FormInput
// //                 label="Ruang Perawatan"
// //                 value={filters.ward_id}
// //                 onChange={(val) => handleFilterChange("ward_id", val)}
// //                 options={
// //                   Array.isArray(wardList)
// //                     ? wardList.map((item) => ({
// //                         label: item.name,
// //                         value: item.id,
// //                       }))
// //                     : []
// //                 }
// //                 dropdownType="select"
// //                 placeholder="Semua Ward"
// //                 className="w-full"
// //                 disabled={loadingWards}
// //               />

// //               <FormInput
// //                 label="Cari Ruangan"
// //                 value={searchTitle}
// //                 onChange={(val) => handleSearchChange(val)}
// //                 placeholder="Ketik label ruangan..."
// //               />

// //               <FormInput
// //                 label="Status"
// //                 value={filters.status}
// //                 onChange={(val) => handleFilterChange("status", val)}
// //                 options={[
// //                   { label: "Aktif", value: "ACTIVE" },
// //                   { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
// //                 ]}
// //                 dropdownType="select"
// //                 placeholder="Semua Status"
// //                 className="w-full"
// //                 searchable={false}
// //               />

// //               {isFilterActive && (
// //                 <ActionButton
// //                   label="Reset Filter"
// //                   onClick={resetFilters}
// //                   color="warning"
// //                   className="h-11.5 w-full"
// //                   icon={RotateCcw}
// //                 />
// //               )}
// //             </div>

// //             {/* INFORMASI DATA: ikut scroll */}
// //             <div className="flex shrink-0 items-center justify-between px-1">
// //               <div className="flex items-center gap-2">
// //                 {isFetching && (
// //                   <div className="flex animate-pulse items-center gap-2 text-sm text-primary">
// //                     <span className="loading loading-spinner loading-xs" />
// //                     <span>Memperbarui data...</span>
// //                   </div>
// //                 )}
// //               </div>

// //               {total !== undefined && (
// //                 <div className="text-data text-base-content/70">
// //                   Total:{" "}
// //                   <span className="font-bold text-base-content">{total}</span>{" "}
// //                   room
// //                 </div>
// //               )}
// //             </div>

// //             {/* TABEL */}
// //             <div className="min-w-0 rounded-xl border border-base-200">
// //               <DataSection
// //                 loading={loading}
// //                 error={error}
// //                 data={data}
// //                 emptyMessage="Belum Ada Data Ruangan"
// //               />

// //               {!loading && !error && data.length > 0 && (
// //                 <TableBase
// //                   columns={[
// //                     {
// //                       header: "No",
// //                       render: (_, index) => (page - 1) * perPage + index + 1,
// //                       className: "w-12 text-center",
// //                     },
// //                     {
// //                       header: "Ruang Perawatan",
// //                       accessor: "ward_name",
// //                       className: "max-w-xs",
// //                     },
// //                     {
// //                       header: "Label",
// //                       accessor: "label",
// //                       className: "text-center",
// //                     },
// //                     {
// //                       header: "Status",
// //                       render: (row) => (
// //                         <span
// //                           className={`badge ${
// //                             row.archived ? "badge-error" : "badge-primary"
// //                           } badge-sm`}
// //                         >
// //                           {row.archived ? "Arsip" : "Aktif"}
// //                         </span>
// //                       ),
// //                       className: "text-center",
// //                     },
// //                     {
// //                       header: "Aksi",
// //                       render: (row) => (
// //                         <div className="inline-flex justify-center gap-2">
// //                           <ActionButton
// //                             to={`/iptv/room/${row.id}/edit`}
// //                             icon={Pencil}
// //                             color="warning"
// //                             tooltip="Edit Data"
// //                           />

// //                           <ActionButton
// //                             onClick={() => handleDelete(row.id)}
// //                             icon={Trash}
// //                             color="error"
// //                             tooltip="Hapus Data"
// //                           />
// //                         </div>
// //                       ),
// //                       className: "text-center",
// //                     },
// //                   ]}
// //                   data={data}
// //                 />
// //               )}
// //             </div>
// //           </div>
// //         </Card>

// //         {/* PAGINATION */}
// // <div className="relative z-50 shrink-0 bg-base-100">
// //   <Pagination
// //     page={page}
// //     lastPage={lastPage}
// //     perPage={perPage}
// //     total={total}
// //     onPageChange={(newPage) => setPage(newPage)}
// //   />
// // </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default RoomPage;

// import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
// import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
// import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
// import ActionButton from "@/components/ActionButton";
// import Breadcrumb from "@/components/Breadcrumb";
// import Card from "@/components/Card";
// import DataSection from "@/components/DataSection";
// import FormInput from "@/components/FormInput";
// import Pagination from "@/components/Pagination";
// import TableBase from "@/components/TableBase";
// import { useTableFilters } from "@/hooks/use-table-filters";
// import { FileQuestion, PenBox, Pencil, RotateCcw, Trash } from "lucide-react";

// const RoomPage = () => {
//   const {
//     page,
//     setPage,
//     searchTitle,
//     filters,
//     activeFilters,
//     handleFilterChange,
//     handleSearchChange,
//     resetFilters,
//   } = useTableFilters(
//     {
//       status: "",
//       ward_id: "",
//     },
//     {
//       searchKey: "title",
//       storeKey: "room-management-page",
//     },
//   );

//   const { data, loading, error, total, lastPage, perPage, isFetching } =
//     useRoomList(page, activeFilters);

//   const { data: wardList, loading: loadingWards } = useWardList(
//     1,
//     undefined,
//     1000,
//   );

//   const { handleDelete } = useRoomDelete();

//   const isFilterActive = Boolean(
//     searchTitle || filters.status || filters.ward_id,
//   );

//   return (
//     <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
//       {/* 1. HEADER HALAMAN */}
//       <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 shrink-0 w-full py-1 z-20">
//         <div className="overflow-x-auto min-w-0">
//           <Breadcrumb
//             items={[
//               { label: "Home", path: "/" },
//               { label: "Dashboard", path: "/app/iptv/dashboard" },
//               { label: "Room" },
//             ]}
//           />
//         </div>

//         {/* Indikator isFetching di tengah header */}
//         <div className="flex items-center gap-2">
//           {isFetching && (
//             <div className="flex items-center gap-2 text-primary text-xs sm:text-sm animate-pulse whitespace-nowrap">
//               <span className="loading loading-spinner loading-xs"></span>
//               <span className="hidden sm:inline">Memperbarui data...</span>
//             </div>
//           )}
//         </div>

//         <div className="shrink-0">
//           <ActionButton
//             to="/app/iptv/room/create"
//             icon={PenBox}
//             label="Tambah Ruangan"
//             color="primary"
//           />
//         </div>
//       </div>

//       {/* 2. CARD UTAMA
//           - Mobile: overflow-y-auto (Filter & seluruh isi card ikut terscroll)
//           - Desktop (lg): overflow-hidden (Hanya tabel di dalamnya yang scroll agar header tabel sticky)
//       */}
//       <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden">
//         {/* Bagian Filter & Pencarian */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm items-end shrink-0">
//           <FormInput
//             label="Ruang Perawatan"
//             value={filters.ward_id}
//             onChange={(val) => handleFilterChange("ward_id", val)}
//             options={
//               Array.isArray(wardList)
//                 ? wardList.map((item) => ({
//                     label: item.name,
//                     value: item.id,
//                   }))
//                 : []
//             }
//             dropdownType="select"
//             // placeholder="Semua Ward"
//             className="w-full"
//             disabled={loadingWards}
//           />

//           <FormInput
//             label="Cari Ruangan"
//             value={searchTitle}
//             onChange={(val) => handleSearchChange(val)}
//             placeholder="Ketik label ruangan..."
//           />

//           <FormInput
//             label="Status"
//             value={filters.status}
//             onChange={(val) => handleFilterChange("status", val)}
//             options={[
//               { label: "Aktif", value: "ACTIVE" },
//               { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
//             ]}
//             dropdownType="select"
//             placeholder="Semua Status"
//             className="w-full"
//             searchable={false}
//           />

//           {isFilterActive && (
//             <ActionButton
//               label="Reset Filter"
//               onClick={resetFilters}
//               color="warning"
//               className="w-full h-11.5"
//               icon={RotateCcw}
//             />
//           )}
//         </div>

//         {/* 3. KONTAINER TABEL
//             - Mobile: overflow-visible (karena card sudah scroll)
//             - Desktop (lg): flex-1 min-h-0 overflow-auto (membuat area tabel scroll sendiri & header tabel sticky)
//         */}
//         <div className="flex flex-col lg:flex-1 lg:min-h-0 relative rounded-xl border border-base-200 md:overflow-auto">
//           <DataSection
//             loading={loading}
//             error={error}
//             data={data}
//             emptyMessage="Belum Ada Data Ruangan"
//             icon={FileQuestion}
//           />

//           {!loading && !error && data.length > 0 && (
//             <TableBase
//               columns={[
//                 {
//                   header: "No",
//                   render: (_, index) => (page - 1) * perPage + index + 1,
//                   className: "text-center w-12",
//                 },
//                 {
//                   header: "Ruang Perawatan",
//                   accessor: "ward_name",
//                   className: "max-w-xs",
//                 },
//                 {
//                   header: "Label",
//                   accessor: "label",
//                   className: "text-center",
//                 },
//                 {
//                   header: "Status",
//                   render: (row) => (
//                     <span
//                       className={`badge ${
//                         row.archived ? "badge-error" : "badge-primary"
//                       } badge-sm`}
//                     >
//                       {row.archived ? "Arsip" : "Aktif"}
//                     </span>
//                   ),
//                   className: "text-center",
//                 },
//                 {
//                   header: "Aksi",
//                   render: (row) => (
//                     <div className="inline-flex justify-center gap-2">
//                       <ActionButton
//                         to={`/iptv/room/${row.id}/edit`}
//                         icon={Pencil}
//                         color="warning"
//                         tooltip="Edit Data"
//                       />

//                       <ActionButton
//                         onClick={() => handleDelete(row.id)}
//                         icon={Trash}
//                         color="error"
//                         tooltip="Hapus Data"
//                       />
//                     </div>
//                   ),
//                   className: "text-center",
//                 },
//               ]}
//               data={data}
//             />
//           )}
//         </div>
//       </Card>

//       {/* 4. PAGINATION DI BAWAH */}
//       <div className="shrink-0 pt-1">
//         <Pagination
//           page={page}
//           lastPage={lastPage}
//           perPage={perPage}
//           total={total}
//           onPageChange={(newPage) => setPage(newPage)}
//         />
//       </div>
//     </div>
//   );
// };

// export default RoomPage;

// // import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
// // import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
// // import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
// // import ActionButton from "@/components/ActionButton";
// // import Breadcrumb from "@/components/Breadcrumb";
// // import Card from "@/components/Card";
// // import DataSection from "@/components/DataSection";
// // import FormInput from "@/components/FormInput";
// // import Pagination from "@/components/Pagination";
// // import TableBase from "@/components/TableBase";
// // import { useTableFilters } from "@/hooks/use-table-filters";
// // import { PenBox, Pencil, RotateCcw, Trash } from "lucide-react";

// // const RoomPage = () => {
// //   const {
// //     page,
// //     setPage,
// //     searchTitle,
// //     filters,
// //     activeFilters,
// //     handleFilterChange,
// //     handleSearchChange,
// //     resetFilters,
// //   } = useTableFilters(
// //     {
// //       status: "",
// //       ward_id: "",
// //     },
// //     {
// //       searchKey: "title",
// //       storeKey: "room-management-page",
// //     },
// //   );

// //   const { data, loading, error, total, lastPage, perPage, isFetching } =
// //     useRoomList(page, activeFilters);

// //   const { data: wardList, loading: loadingWards } = useWardList(
// //     1,
// //     undefined,
// //     1000,
// //   );

// //   const { handleDelete } = useRoomDelete();

// //   const isFilterActive = Boolean(
// //     searchTitle || filters.status || filters.ward_id,
// //   );

// //   return (
// //     <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
// //       {/* 1. HEADER HALAMAN (Tetap diam di atas) */}
// //       <div className="relative z-50 flex w-full shrink-0 items-center justify-between gap-2  sm:gap-4">
// //         <div className="min-w-0 overflow-x-auto py-1">
// //           <Breadcrumb
// //             items={[
// //               { label: "Home", path: "/" },
// //               { label: "Dashboard", path: "/app/iptv/dashboard" },
// //               { label: "Room" },
// //             ]}
// //           />
// //         </div>

// //         <div className="shrink-0">
// //           <ActionButton
// //             to="/app/iptv/room/create"
// //             icon={PenBox}
// //             label="Tambah Ruangan"
// //             color="primary"
// //           />
// //         </div>
// //       </div>

// //       {/* 2. CARD UTAMA (Sebagai wadah statis, tidak scroll seluruhnya) */}
// //       <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
// //         {/* Bagian Filter & Pencarian (Diam di atas card, tidak ikut terscroll) */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm items-end shrink-0">
// //           <FormInput
// //             label="Ruang Perawatan"
// //             value={filters.ward_id}
// //             onChange={(val) => handleFilterChange("ward_id", val)}
// //             options={
// //               Array.isArray(wardList)
// //                 ? wardList.map((item) => ({
// //                     label: item.name,
// //                     value: item.id,
// //                   }))
// //                 : []
// //             }
// //             dropdownType="select"
// //             placeholder="Semua Ward"
// //             className="w-full"
// //             disabled={loadingWards}
// //           />

// //           <FormInput
// //             label="Cari Ruangan"
// //             value={searchTitle}
// //             onChange={(val) => handleSearchChange(val)}
// //             placeholder="Ketik label ruangan..."
// //           />

// //           <FormInput
// //             label="Status"
// //             value={filters.status}
// //             onChange={(val) => handleFilterChange("status", val)}
// //             options={[
// //               { label: "Aktif", value: "ACTIVE" },
// //               { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
// //             ]}
// //             dropdownType="select"
// //             placeholder="Semua Status"
// //             className="w-full"
// //             searchable={false}
// //           />

// //           {isFilterActive && (
// //             <ActionButton
// //               label="Reset Filter"
// //               onClick={resetFilters}
// //               color="warning"
// //               className="w-full h-11.5"
// //               icon={RotateCcw}
// //             />
// //           )}
// //         </div>

// //         {/* Indikator isFetching & Total */}
// //         <div className="flex items-center justify-between px-1 shrink-0">
// //           <div className="flex items-center gap-2">
// //             {isFetching && (
// //               <div className="flex items-center gap-2 text-primary text-sm animate-pulse">
// //                 <span className="loading loading-spinner loading-xs"></span>
// //                 <span>Memperbarui data...</span>
// //               </div>
// //             )}
// //           </div>

// //           {total !== undefined && (
// //             <div className="text-data text-base-content/70">
// //               Total:{" "}
// //               <span className="font-bold text-base-content">{total}</span> room
// //             </div>
// //           )}
// //         </div>

// //         {/* 3. KONTAINER TABEL DENGAN SCROLL MANDIRI (Membuat header tabel sticky berfungsi sempurna) */}
// //         <div className="flex-1 min-h-0 relative rounded-xl border border-base-200 overflow-auto">
// //           <DataSection
// //             loading={loading}
// //             error={error}
// //             data={data}
// //             emptyMessage="Belum Ada Data Ruangan"
// //           />

// //           {!loading && !error && data.length > 0 && (
// //             <TableBase
// //               columns={[
// //                 {
// //                   header: "No",
// //                   render: (_, index) => (page - 1) * perPage + index + 1,
// //                   className: "text-center w-12",
// //                 },
// //                 {
// //                   header: "Ruang Perawatan",
// //                   accessor: "ward_name",
// //                   className: "max-w-xs",
// //                 },
// //                 {
// //                   header: "Label",
// //                   accessor: "label",
// //                   className: "text-center",
// //                 },
// //                 {
// //                   header: "Status",
// //                   render: (row) => (
// //                     <span
// //                       className={`badge ${
// //                         row.archived ? "badge-error" : "badge-primary"
// //                       } badge-sm`}
// //                     >
// //                       {row.archived ? "Arsip" : "Aktif"}
// //                     </span>
// //                   ),
// //                   className: "text-center",
// //                 },
// //                 {
// //                   header: "Aksi",
// //                   render: (row) => (
// //                     <div className="inline-flex justify-center gap-2">
// //                       <ActionButton
// //                         to={`/iptv/room/${row.id}/edit`}
// //                         icon={Pencil}
// //                         color="warning"
// //                         tooltip="Edit Data"
// //                       />

// //                       <ActionButton
// //                         onClick={() => handleDelete(row.id)}
// //                         icon={Trash}
// //                         color="error"
// //                         tooltip="Hapus Data"
// //                       />
// //                     </div>
// //                   ),
// //                   className: "text-center",
// //                 },
// //               ]}
// //               data={data}
// //             />
// //           )}
// //         </div>
// //       </Card>

// //       {/* 4. PAGINATION DI BAWAH */}
// //       <div className="relative z-50 shrink-0">
// //         <Pagination
// //           page={page}
// //           lastPage={lastPage}
// //           perPage={perPage}
// //           total={total}
// //           onPageChange={(newPage) => setPage(newPage)}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoomPage;
import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
import { PageTop, PageMiddle, PageBottom } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import DataSection from "@/components/DataSection";
import FormInput from "@/components/FormInput";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { PenBox, Pencil, RotateCcw, Trash } from "lucide-react";

const RoomPage = () => {
  const {
    page,
    setPage,
    searchTitle,
    filters,
    activeFilters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useTableFilters(
    {
      status: "",
      ward_id: "",
    },
    {
      searchKey: "title",
      storeKey: "room-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useRoomList(page, activeFilters);

  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );

  const { handleDelete } = useRoomDelete();

  const isFilterActive = Boolean(
    searchTitle || filters.status || filters.ward_id,
  );

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      {/* 1. BAGIAN TOP (Bebas diisi apa saja secara manual) */}
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "Room" },
              ]}
            />
          </div>

          {/* Indikator isFetching di tengah */}
          <div className="flex items-center gap-2">
            {isFetching && (
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm animate-pulse whitespace-nowrap">
                <span className="loading loading-spinner loading-xs"></span>
                <span className="hidden sm:inline">Memperbarui data...</span>
              </div>
            )}
          </div>

          {/* Anda bisa menaruh banyak tombol di sini jika butuh */}
          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/room/create"
              icon={PenBox}
              label="Tambah Ruangan"
              color="primary"
            />
          </div>
        </div>
      </PageTop>

      {/* 2. BAGIAN MIDDLE (Card pembungkus filter & tabel dengan auto scroll) */}
      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          {/* Bagian Filter Manual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm items-end shrink-0">
            <FormInput
              label="Ruang Perawatan"
              value={filters.ward_id}
              onChange={(val) => handleFilterChange("ward_id", val)}
              options={
                Array.isArray(wardList)
                  ? wardList.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              dropdownType="select"
              placeholder="Semua Ward"
              className="w-full"
              disabled={loadingWards}
            />

            <FormInput
              label="Cari Ruangan"
              value={searchTitle}
              onChange={(val) => handleSearchChange(val)}
              placeholder="Ketik label ruangan..."
            />

            <FormInput
              label="Status"
              value={filters.status}
              onChange={(val) => handleFilterChange("status", val)}
              options={[
                { label: "Aktif", value: "ACTIVE" },
                { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
              ]}
              dropdownType="select"
              placeholder="Semua Status"
              className="w-full"
              searchable={false}
            />

            {isFilterActive && (
              <ActionButton
                label="Reset Filter"
                onClick={resetFilters}
                color="warning"
                className="w-full h-11.5"
                icon={RotateCcw}
              />
            )}
          </div>

          {/* Bagian Kontainer Tabel (Sticky Header aktif otomatis) */}
          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative rounded-xl border border-base-200 md:overflow-auto">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data Ruangan"
            />

            {!loading && !error && data.length > 0 && (
              <TableBase
                columns={[
                  {
                    header: "No",
                    render: (_, index) => (page - 1) * perPage + index + 1,
                    className: "text-center w-12",
                  },
                  {
                    header: "Ruang Perawatan",
                    accessor: "ward_name",
                    className: "max-w-xs",
                  },
                  {
                    header: "Label",
                    accessor: "label",
                    className: "text-center",
                  },
                  {
                    header: "Status",
                    render: (row) => (
                      <span
                        className={`badge ${
                          row.archived ? "badge-error" : "badge-primary"
                        } badge-sm`}
                      >
                        {row.archived ? "Arsip" : "Aktif"}
                      </span>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        <ActionButton
                          to={`/iptv/room/${row.id}/edit`}
                          icon={Pencil}
                          color="warning"
                          tooltip="Edit Data"
                        />

                        <ActionButton
                          onClick={() => handleDelete(row.id)}
                          icon={Trash}
                          color="error"
                          tooltip="Hapus Data"
                        />
                      </div>
                    ),
                    className: "text-center",
                  },
                ]}
                data={data}
              />
            )}
          </div>
        </Card>
      </PageMiddle>

      {/* 3. BAGIAN BOTTOM (Pagination) */}
      <PageBottom>
        <Pagination
          page={page}
          lastPage={lastPage}
          perPage={perPage}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </PageBottom>
    </div>
  );
};

export default RoomPage;
