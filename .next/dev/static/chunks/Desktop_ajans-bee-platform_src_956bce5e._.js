(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/ajans-bee-platform/src/lib/notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Bildirim tipleri
__turbopack_context__.s([
    "createNotification",
    ()=>createNotification,
    "notifyAdmins",
    ()=>notifyAdmins
]);
async function createNotification(supabase, data) {
    const { error } = await supabase.from('notifications').insert(data);
    if (error) {
        console.error('Notification create error:', error);
    }
    return !error;
}
async function notifyAdmins(supabase, data) {
    // Admin ID'lerini al
    const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin').eq('is_active', true);
    if (!admins || admins.length === 0) return false;
    // Her admin için bildirim oluştur
    const notifications = admins.map((admin)=>({
            user_id: admin.id,
            ...data
        }));
    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) {
        console.error('Notify admins error:', error);
    }
    return !error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Office and work schedule constants
__turbopack_context__.s([
    "HYBRID_DAYS",
    ()=>HYBRID_DAYS,
    "OFFICE_LOCATION",
    ()=>OFFICE_LOCATION,
    "WORK_HOURS",
    ()=>WORK_HOURS
]);
const OFFICE_LOCATION = {
    lat: 38.450468,
    lng: 27.186318,
    radius: 100
};
const WORK_HOURS = {
    start: '09:00',
    end: '18:30',
    toleranceMinutes: 0
};
const HYBRID_DAYS = [
    2,
    4
] // Tuesday, Thursday
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "avatarColors",
    ()=>avatarColors,
    "calculateDistance",
    ()=>calculateDistance,
    "calculateDuration",
    ()=>calculateDuration,
    "calculateEarlyLeaveMinutes",
    ()=>calculateEarlyLeaveMinutes,
    "calculateLateMinutes",
    ()=>calculateLateMinutes,
    "calculateOvertimeMinutes",
    ()=>calculateOvertimeMinutes,
    "formatMinutes",
    ()=>formatMinutes,
    "formatMinutesToHours",
    ()=>formatMinutesToHours,
    "formatShortDate",
    ()=>formatShortDate,
    "formatTime",
    ()=>formatTime,
    "getAvatarColor",
    ()=>getAvatarColor,
    "getLocation",
    ()=>getLocation,
    "getLocationType",
    ()=>getLocationType,
    "isHybridDay",
    ()=>isHybridDay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/constants.ts [app-client] (ecmascript)");
;
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function getLocationType(lat, lng) {
    return calculateDistance(lat, lng, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICE_LOCATION"].lat, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICE_LOCATION"].lng) <= __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICE_LOCATION"].radius ? 'office' : 'other';
}
function calculateLateMinutes(checkInTime) {
    const [startHour, startMinute] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK_HOURS"].start.split(':').map(Number);
    const workStart = new Date(checkInTime);
    workStart.setHours(startHour, startMinute, 0, 0);
    const diffMinutes = Math.floor((checkInTime.getTime() - workStart.getTime()) / 60000);
    return diffMinutes <= __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK_HOURS"].toleranceMinutes ? 0 : Math.max(0, diffMinutes);
}
function calculateOvertimeMinutes(checkOutTime) {
    const [endHour, endMinute] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK_HOURS"].end.split(':').map(Number);
    const workEnd = new Date(checkOutTime);
    workEnd.setHours(endHour, endMinute, 0, 0);
    return Math.max(0, Math.floor((checkOutTime.getTime() - workEnd.getTime()) / 60000));
}
function calculateEarlyLeaveMinutes(checkOutTime) {
    const [endHour, endMinute] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK_HOURS"].end.split(':').map(Number);
    const workEnd = new Date(checkOutTime);
    workEnd.setHours(endHour, endMinute, 0, 0);
    return Math.max(0, Math.floor((workEnd.getTime() - checkOutTime.getTime()) / 60000));
}
function isHybridDay(date = new Date()) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HYBRID_DAYS"].includes(date.getDay());
}
function formatTime(isoString) {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
function formatShortDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}
function calculateDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '--';
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return `${Math.floor(diff / 3600000)}s ${Math.floor(diff % 3600000 / 60000)}d`;
}
function formatMinutes(minutes) {
    if (!minutes || minutes === 0) return null;
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return h > 0 ? m > 0 ? `${h}s ${m}d` : `${h}s` : `${m}d`;
}
function formatMinutesToHours(minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return h > 0 ? `+${h}s` : `+${m}d`;
}
function getLocation() {
    return new Promise((resolve)=>{
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition((position)=>resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }), ()=>resolve(null), {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    });
}
const avatarColors = [
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-teal-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600'
];
function getAvatarColor(name) {
    return avatarColors[name?.charCodeAt(0) % avatarColors.length || 0];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeHeader",
    ()=>TimeHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
'use client';
;
;
function TimeHeader({ currentTime, formattedDate, dayName, isHybridDay, variant = 'admin' }) {
    if (variant === 'staff') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl p-8 text-center",
            style: {
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-block mb-4",
                    style: {
                        animation: 'float 3s ease-in-out infinite'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 rounded-2xl inline-block",
                        style: {
                            background: 'rgba(139,92,246,0.1)',
                            border: '1px solid rgba(139,92,246,0.2)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            className: "w-10 h-10 text-violet-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                            lineNumber: 25,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-6xl font-mono font-bold text-white mb-2",
                    children: currentTime.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg text-zinc-400 mb-4",
                    children: [
                        formattedDate,
                        " ",
                        dayName
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                isHybridDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    style: {
                        background: 'rgba(139,92,246,0.2)',
                        color: '#a78bfa',
                        border: '1px solid rgba(139,92,246,0.3)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this),
                        "Hibrit Gün (Evden çalışabilirsiniz)"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                    lineNumber: 33,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "w-5 h-5 text-violet-400"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl font-mono font-bold text-white",
                        children: currentTime.toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-px h-8 bg-white/10"
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                        className: "w-5 h-5 text-indigo-400"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-base font-medium text-zinc-300",
                        children: [
                            formattedDate,
                            " ",
                            dayName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            isHybridDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-8 bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                        style: {
                            background: 'rgba(139,92,246,0.2)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139,92,246,0.3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            "Hibrit Gün"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c = TimeHeader;
var _c;
__turbopack_context__.k.register(_c, "TimeHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatsCards",
    ()=>StatsCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
'use client';
;
;
function StatsCards({ totalUsers, officeCount, homeCount, notArrivedCount }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-4 gap-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl p-5 transition-all hover:-translate-y-0.5",
                style: {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(99,102,241,0.4)',
                    boxShadow: '0 0 20px -5px rgba(99,102,241,0.4)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl w-fit mb-4",
                        style: {
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.2)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: "w-6 h-6 text-indigo-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-bold text-white mb-1",
                        children: totalUsers
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500",
                        children: "Toplam Personel"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl p-5 transition-all hover:-translate-y-0.5",
                style: {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(16,185,129,0.4)',
                    boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl w-fit mb-4",
                        style: {
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            className: "w-6 h-6 text-emerald-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-bold text-white mb-1",
                        children: officeCount
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500",
                        children: "Ofiste"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl p-5 transition-all hover:-translate-y-0.5",
                style: {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl w-fit mb-4",
                        style: {
                            background: 'rgba(139,92,246,0.1)',
                            border: '1px solid rgba(139,92,246,0.2)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                            className: "w-6 h-6 text-violet-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-bold text-white mb-1",
                        children: homeCount
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500",
                        children: "Evden Çalışıyor"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl p-5 transition-all hover:-translate-y-0.5",
                style: {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(244,63,94,0.4)',
                    boxShadow: '0 0 20px -5px rgba(244,63,94,0.4)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl w-fit mb-4",
                        style: {
                            background: 'rgba(244,63,94,0.1)',
                            border: '1px solid rgba(244,63,94,0.2)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "w-6 h-6 text-rose-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-bold text-white mb-1",
                        children: notArrivedCount
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500",
                        children: "Henüz Gelmedi"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = StatsCards;
var _c;
__turbopack_context__.k.register(_c, "StatsCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttendanceRow",
    ()=>AttendanceRow,
    "EmptyAttendanceRow",
    ()=>EmptyAttendanceRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/tree-palm.js [app-client] (ecmascript) <export default as Palmtree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarOff$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar-off.js [app-client] (ecmascript) <export default as CalendarOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function AttendanceRow({ record, isHybridDay }) {
    const isLeave = record.record_type === 'leave';
    const isSick = record.record_type === 'sick';
    const isRemote = record.record_type === 'remote';
    const isHoliday = record.record_type === 'holiday';
    const isSpecialRecord = isLeave || isSick || isRemote || isHoliday;
    const isOffice = record.check_in_location_type === 'office';
    const isHome = record.check_in_location_type === 'home';
    const isOther = record.check_in_location_type === 'other';
    const hasLate = !isSpecialRecord && (record.late_minutes ?? 0) > 0;
    const hasOvertime = !isSpecialRecord && (record.overtime_minutes ?? 0) > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `h-11 w-11 rounded-xl bg-gradient-to-br ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(record.user?.full_name || '')} flex items-center justify-center`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-white text-sm font-bold",
                    children: record.user?.full_name?.charAt(0) || '?'
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-white",
                        children: record.user?.full_name || 'Bilinmeyen'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mt-1",
                        children: isSpecialRecord ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-zinc-500 text-sm",
                            children: "Tam gün"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-emerald-400 text-sm font-mono",
                                    children: [
                                        "→ ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(record.check_in)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-zinc-600",
                                    children: "···"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-zinc-500 text-sm font-mono",
                                    children: [
                                        "← ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(record.check_out)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    isLeave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                        style: {
                            background: 'rgba(34,211,238,0.2)',
                            color: '#22d3ee',
                            border: '1px solid rgba(34,211,238,0.3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            "İzin"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    isSick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                        style: {
                            background: 'rgba(244,63,94,0.2)',
                            color: '#fb7185',
                            border: '1px solid rgba(244,63,94,0.3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this),
                            "Rapor"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    isHoliday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                        style: {
                            background: 'rgba(245,158,11,0.2)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245,158,11,0.3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarOff$3e$__["CalendarOff"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            "Tatil"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    !isSpecialRecord && record.check_in && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            isOffice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                                style: {
                                    background: 'rgba(16,185,129,0.2)',
                                    color: '#34d399',
                                    border: '1px solid rgba(16,185,129,0.3)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 73,
                                        columnNumber: 17
                                    }, this),
                                    "Ofiste",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 73,
                                        columnNumber: 56
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 72,
                                columnNumber: 15
                            }, this),
                            isHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                                        style: {
                                            background: 'rgba(59,130,246,0.2)',
                                            color: '#60a5fa',
                                            border: '1px solid rgba(59,130,246,0.3)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                                lineNumber: 79,
                                                columnNumber: 19
                                            }, this),
                                            "Evden"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    isHybridDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2 py-1 rounded-full",
                                        style: {
                                            background: 'rgba(139,92,246,0.2)',
                                            color: '#a78bfa',
                                            border: '1px solid rgba(139,92,246,0.3)'
                                        },
                                        children: "Hibrit"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 82,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            isOther && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                                        style: {
                                            background: 'rgba(244,63,94,0.2)',
                                            color: '#fb7185',
                                            border: '1px solid rgba(244,63,94,0.3)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                                lineNumber: 89,
                                                columnNumber: 19
                                            }, this),
                                            "Ofiste"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                                        style: {
                                            background: 'rgba(244,63,94,0.2)',
                                            color: '#fb7185',
                                            border: '1px solid rgba(244,63,94,0.3)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, this),
                                            "Dışarıda!"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                        lineNumber: 91,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true),
                    hasLate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2 py-1 rounded-full font-mono",
                        style: {
                            background: 'rgba(244,63,94,0.2)',
                            color: '#fb7185',
                            border: '1px solid rgba(244,63,94,0.3)'
                        },
                        children: [
                            "+",
                            record.late_minutes,
                            "d geç"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    hasOvertime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-mono",
                        style: {
                            background: 'rgba(245,158,11,0.2)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245,158,11,0.3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            "+",
                            record.overtime_minutes,
                            "d mesai"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right min-w-[80px]",
                children: isSpecialRecord ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-zinc-500",
                    children: "--"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 111,
                    columnNumber: 11
                }, this) : record.check_out ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-mono text-zinc-400",
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateDuration"])(record.check_in, record.check_out)
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this) : record.check_in ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-zinc-500",
                            children: "--"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-emerald-400 mt-0.5",
                            children: "Devam ediyor"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 115,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-zinc-500",
                    children: "--"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 120,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = AttendanceRow;
function EmptyAttendanceRow({ userName, userInitial }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 px-5 py-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-11 w-11 rounded-xl bg-zinc-700 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-zinc-400 text-sm font-bold",
                    children: userInitial
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-zinc-400",
                        children: userName
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-600 text-sm font-mono",
                                children: "→ --:--"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-700",
                                children: "···"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-600 text-sm font-mono",
                                children: "← --:--"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                    style: {
                        background: 'rgba(244,63,94,0.2)',
                        color: '#fb7185',
                        border: '1px solid rgba(244,63,94,0.3)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        "Henüz gelmedi"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right min-w-[80px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-zinc-500",
                    children: "--"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c1 = EmptyAttendanceRow;
var _c, _c1;
__turbopack_context__.k.register(_c, "AttendanceRow");
__turbopack_context__.k.register(_c1, "EmptyAttendanceRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HistoryRow",
    ()=>HistoryRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/tree-palm.js [app-client] (ecmascript) <export default as Palmtree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function HistoryRow({ record }) {
    const isLeave = record.record_type === 'leave';
    const isSick = record.record_type === 'sick';
    const isRemote = record.record_type === 'remote';
    const isHoliday = record.record_type === 'holiday';
    const isSpecialRecord = isLeave || isSick || isRemote || isHoliday;
    const hasLate = !isSpecialRecord && (record.late_minutes ?? 0) > 0;
    const hasOvertime = !isSpecialRecord && (record.overtime_minutes ?? 0) > 0;
    const recordIsHybrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHybridDay"])(new Date(record.date));
    const duration = record.check_in && record.check_out ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateDuration"])(record.check_in, record.check_out) : null;
    let badgeStyle = {
        bg: 'rgba(16,185,129,0.2)',
        color: '#34d399',
        border: '1px solid rgba(16,185,129,0.3)'
    };
    let badgeText = 'Zamanında';
    let badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
        className: "w-3 h-3"
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
        lineNumber: 31,
        columnNumber: 19
    }, this);
    if (isLeave) {
        badgeStyle = {
            bg: 'rgba(34,211,238,0.2)',
            color: '#22d3ee',
            border: '1px solid rgba(34,211,238,0.3)'
        };
        badgeText = 'İzin';
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 36,
            columnNumber: 17
        }, this);
    } else if (isSick) {
        badgeStyle = {
            bg: 'rgba(244,63,94,0.2)',
            color: '#fb7185',
            border: '1px solid rgba(244,63,94,0.3)'
        };
        badgeText = 'Rapor';
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 40,
            columnNumber: 17
        }, this);
    } else if (isRemote) {
        badgeStyle = {
            bg: 'rgba(59,130,246,0.2)',
            color: '#60a5fa',
            border: '1px solid rgba(59,130,246,0.3)'
        };
        badgeText = 'Evden';
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 44,
            columnNumber: 17
        }, this);
    } else if (hasLate && hasOvertime) {
        badgeStyle = {
            bg: 'rgba(139,92,246,0.2)',
            color: '#a78bfa',
            border: '1px solid rgba(139,92,246,0.3)'
        };
        badgeText = `Geç + Mesai (${record.late_minutes}d) (+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMinutes"])(record.overtime_minutes)})`;
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 48,
            columnNumber: 17
        }, this);
    } else if (hasLate) {
        badgeStyle = {
            bg: 'rgba(244,63,94,0.2)',
            color: '#fb7185',
            border: '1px solid rgba(244,63,94,0.3)'
        };
        badgeText = `Geç Kalma (${record.late_minutes}d)`;
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 52,
            columnNumber: 17
        }, this);
    } else if (hasOvertime) {
        badgeStyle = {
            bg: 'rgba(245,158,11,0.2)',
            color: '#fbbf24',
            border: '1px solid rgba(245,158,11,0.3)'
        };
        badgeText = `Mesai (+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMinutes"])(record.overtime_minutes)})`;
        badgeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
            className: "w-3 h-3"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
            lineNumber: 56,
            columnNumber: 17
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-2.5 rounded-xl ${isLeave ? 'bg-cyan-500/10 border-cyan-500/20' : isSick ? 'bg-rose-500/10 border-rose-500/20' : isRemote ? 'bg-blue-500/10 border-blue-500/20' : hasLate ? 'bg-rose-500/10 border-rose-500/20' : hasOvertime ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} border`,
                children: isLeave ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"], {
                    className: "w-5 h-5 text-cyan-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 62,
                    columnNumber: 20
                }, this) : isSick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                    className: "w-5 h-5 text-rose-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 63,
                    columnNumber: 19
                }, this) : isRemote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                    className: "w-5 h-5 text-blue-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 64,
                    columnNumber: 21
                }, this) : hasLate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-5 h-5 text-rose-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 65,
                    columnNumber: 20
                }, this) : hasOvertime ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                    className: "w-5 h-5 text-amber-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 66,
                    columnNumber: 24
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-5 h-5 text-emerald-400"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 67,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-white",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatShortDate"])(record.date)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            recordIsHybrid && !isSpecialRecord && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs px-1.5 py-0.5 rounded",
                                style: {
                                    background: 'rgba(139,92,246,0.2)',
                                    color: '#a78bfa'
                                },
                                children: "Hibrit"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500",
                        children: isSpecialRecord ? 'Tam gün' : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(record.check_in)} → ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(record.check_out)}`
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
                    style: {
                        background: badgeStyle.bg,
                        color: badgeStyle.color,
                        border: badgeStyle.border
                    },
                    children: [
                        badgeIcon,
                        badgeText
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right min-w-[60px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-mono text-zinc-400",
                    children: duration || '--'
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c = HistoryRow;
var _c;
__turbopack_context__.k.register(_c, "HistoryRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonthlySummary",
    ()=>MonthlySummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
'use client';
;
;
function MonthlySummary({ totalWorkHours, avgMinutes, totalOvertime, totalLateDays, isAdmin = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl p-5",
        style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "w-5 h-5 text-indigo-400"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-white",
                        children: isAdmin ? 'Bu Ay Özeti' : 'Bu Ay Özetim'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-400",
                                children: "Toplam Çalışma"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-mono text-white font-semibold",
                                children: [
                                    totalWorkHours,
                                    " saat"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-400",
                                children: "Ortalama / Gün"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-mono text-white",
                                children: [
                                    Math.floor(avgMinutes / 60),
                                    "s ",
                                    avgMinutes % 60,
                                    "d"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-400",
                                children: "Toplam Mesai"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-mono text-emerald-400",
                                children: [
                                    "+",
                                    Math.floor(totalOvertime / 60),
                                    " saat"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-400",
                                children: "Geç Kalma"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-mono text-rose-400",
                                children: [
                                    totalLateDays,
                                    " gün"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = MonthlySummary;
var _c;
__turbopack_context__.k.register(_c, "MonthlySummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Leaderboard",
    ()=>Leaderboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Leaderboard({ topWorkers, topLate, showBadge = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl p-5",
        style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                className: "w-5 h-5 text-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 18,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-white",
                                children: "Bu Ay Liderlik"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    showBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2 py-1 rounded-full",
                        style: {
                            background: 'rgba(245,158,11,0.2)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245,158,11,0.3)'
                        },
                        children: "🏆 Ödül"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "💪"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            " EN ÇOK MESAİ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: topWorkers.map((user, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-amber-500/10' : 'hover:bg-white/5'} transition-colors`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm font-bold w-5 ${i === 0 ? 'text-amber-400' : 'text-zinc-500'}`,
                                        children: [
                                            i + 1,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-8 w-8 rounded-lg bg-gradient-to-br ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(user.full_name || '')} flex items-center justify-center flex-shrink-0`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white text-xs font-bold",
                                            children: user.full_name?.charAt(0)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                            lineNumber: 36,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white flex-1",
                                        children: user.full_name
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 38,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm font-mono ${i === 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`,
                                        children: user.overtime > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMinutesToHours"])(user.overtime) : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, user.id, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-white/10 my-5"
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "😅"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            " EN ÇOK GEÇ KALAN"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: topLate.length > 0 ? topLate.map((user, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-rose-500/10' : 'hover:bg-white/5'} transition-colors`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm font-bold w-5 ${i === 0 ? 'text-rose-400' : 'text-zinc-500'}`,
                                        children: [
                                            i + 1,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-8 w-8 rounded-lg bg-gradient-to-br ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(user.full_name || '')} flex items-center justify-center flex-shrink-0`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white text-xs font-bold",
                                            children: user.full_name?.charAt(0)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white flex-1",
                                        children: user.full_name
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-sm font-mono ${i === 0 ? 'text-rose-400 font-semibold' : 'text-rose-400'}`,
                                        children: [
                                            user.lateDays,
                                            " gün"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, user.id, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-zinc-500 text-center py-2",
                            children: "Geç kalan yok 🎉"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Leaderboard;
var _c;
__turbopack_context__.k.register(_c, "Leaderboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WeeklyTrend",
    ()=>WeeklyTrend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
'use client';
;
;
function WeeklyTrend({ data }) {
    const colors = [
        '#10b981',
        '#14b8a6',
        '#06b6d4',
        '#3b82f6',
        '#f59e0b'
    ];
    const maxHours = Math.max(...data.map((t)=>t.hours), 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl p-5",
        style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                        className: "w-5 h-5 text-emerald-400"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-white",
                        children: "Haftalık Trend"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: data.map((item, i)=>{
                    const percentage = item.hours / maxHours * 100;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-zinc-400",
                                        children: item.day
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                                        lineNumber: 26,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-mono text-zinc-300",
                                        children: [
                                            item.hours,
                                            "s"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                                        lineNumber: 27,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                                lineNumber: 25,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 rounded-full overflow-hidden",
                                style: {
                                    background: 'rgba(255,255,255,0.1)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full transition-all duration-500",
                                    style: {
                                        width: `${percentage}%`,
                                        background: `linear-gradient(90deg, ${colors[i]} 0%, ${colors[(i + 1) % colors.length]} 100%)`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                                    lineNumber: 30,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                                lineNumber: 29,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.day, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                        lineNumber: 24,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = WeeklyTrend;
var _c;
__turbopack_context__.k.register(_c, "WeeklyTrend");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
    variants: {
        variant: {
            // Primary gradient button
            default: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
            // Danger/destructive button
            destructive: "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20",
            // Outline button
            outline: "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
            // Secondary subtle button
            secondary: "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white",
            // Ghost transparent button
            ghost: "text-zinc-400 hover:bg-white/10 hover:text-white",
            // Link style
            link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
            // Success button
            success: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
            // AI/Special button
            ai: "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40"
        },
        size: {
            default: "h-10 px-5 py-2.5",
            sm: "h-8 px-3 text-xs",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/button.tsx",
        lineNumber: 61,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MyStatusCard",
    ()=>MyStatusCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/log-in.js [app-client] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function MyStatusCard({ myRecord, actionLoading, hasCheckedIn, hasCheckedOut, onCheckIn, onCheckOut }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl p-5",
        style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16,185,129,0.4)',
            boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                        className: "w-5 h-5 text-emerald-400"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-white",
                        children: "Benim Durumum"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl",
                        style: {
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                        className: "w-4 h-4 text-emerald-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-zinc-400",
                                        children: "Giriş"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold font-mono text-white",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(myRecord?.check_in || null)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            (myRecord?.late_minutes ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-rose-400 mt-1",
                                children: [
                                    "+",
                                    myRecord?.late_minutes,
                                    "d geç"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 rounded-xl",
                        style: {
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                        className: "w-4 h-4 text-rose-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                        lineNumber: 45,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-zinc-400",
                                        children: "Çıkış"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                        lineNumber: 46,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold font-mono text-white",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(myRecord?.check_out || null)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            (myRecord?.overtime_minutes ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-amber-400 mt-1",
                                children: [
                                    "+",
                                    myRecord?.overtime_minutes,
                                    "d mesai"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onCheckIn,
                        disabled: actionLoading || hasCheckedIn || hasCheckedOut,
                        variant: "default",
                        className: "flex-1 py-3 rounded-xl",
                        children: [
                            actionLoading && !hasCheckedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            "Geldim"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onCheckOut,
                        disabled: actionLoading || !hasCheckedIn || hasCheckedOut,
                        variant: "destructive",
                        className: "flex-1 py-3 rounded-xl",
                        children: [
                            actionLoading && hasCheckedIn && !hasCheckedOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            "Gittim"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            myRecord?.check_in && myRecord?.check_out && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 pt-4 border-t border-white/10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-500 mb-1",
                        children: "Toplam Çalışma"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold font-mono text-white",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateDuration"])(myRecord.check_in, myRecord.check_out)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = MyStatusCard;
var _c;
__turbopack_context__.k.register(_c, "MyStatusCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$monthly$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$weekly$2d$trend$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$my$2d$status$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LateReasonModal",
    ()=>LateReasonModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function LateReasonModal({ pendingCheckIn, lateReason, setLateReason, onCancel, onSave }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl p-6 w-full max-w-md mx-4",
            style: {
                background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.99) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-white mb-2",
                    children: "Geç Kalma Açıklaması"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-zinc-400 mb-4",
                    children: [
                        pendingCheckIn.lateMinutes,
                        " dakika geç kaldınız. Lütfen sebebini yazın."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: lateReason,
                    onChange: (e)=>setLateReason(e.target.value),
                    placeholder: "Geç kalma sebebinizi yazın...",
                    className: "w-full h-24 rounded-xl p-3 text-sm resize-none focus:outline-none text-white placeholder:text-zinc-600",
                    style: {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                    autoFocus: true
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400",
                            style: {
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            },
                            children: "İptal"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSave,
                            disabled: !lateReason.trim(),
                            className: "flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50",
                            style: {
                                background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                            },
                            children: "Kaydet"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = LateReasonModal;
var _c;
__turbopack_context__.k.register(_c, "LateReasonModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OvertimeReasonModal",
    ()=>OvertimeReasonModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function OvertimeReasonModal({ pendingCheckOut, overtimeReason, setOvertimeReason, onCancel, onSave }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl p-6 w-full max-w-md mx-4",
            style: {
                background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.99) 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-white mb-2",
                    children: "Mesai Açıklaması"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-zinc-400 mb-4",
                    children: [
                        pendingCheckOut.overtimeMinutes,
                        " dakika mesai yaptınız. Lütfen ne için çalıştığınızı yazın."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: overtimeReason,
                    onChange: (e)=>setOvertimeReason(e.target.value),
                    placeholder: "Mesai sebebinizi yazın...",
                    className: "w-full h-24 rounded-xl p-3 text-sm resize-none focus:outline-none text-white placeholder:text-zinc-600",
                    style: {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                    autoFocus: true
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400",
                            style: {
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            },
                            children: "İptal"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSave,
                            disabled: !overtimeReason.trim(),
                            className: "flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50",
                            style: {
                                background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                            },
                            children: "Kaydet"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = OvertimeReasonModal;
var _c;
__turbopack_context__.k.register(_c, "OvertimeReasonModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$late$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$overtime$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
            lineNumber: 47,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                    lineNumber: 96,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-100 dark:focus:bg-white/10 focus:text-zinc-900 dark:focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                    lineNumber: 127,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
                lineNumber: 132,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 118,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx",
        lineNumber: 141,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ManualEntryModal",
    ()=>ManualEntryModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/tree-palm.js [app-client] (ecmascript) <export default as Palmtree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarOff$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar-off.js [app-client] (ecmascript) <export default as CalendarOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar-range.js [app-client] (ecmascript) <export default as CalendarRange>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const RECORD_TYPES = [
    {
        value: 'leave',
        label: 'Yıllık İzin',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$palm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palmtree$3e$__["Palmtree"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
            lineNumber: 36,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: 'emerald',
        description: 'Yıllık izin kullanımı'
    },
    {
        value: 'sick',
        label: 'Rapor',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
            lineNumber: 43,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: 'rose',
        description: 'Sağlık raporu'
    },
    {
        value: 'remote',
        label: 'Evden Çalışma',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
            lineNumber: 50,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: 'blue',
        description: 'Uzaktan çalışma'
    },
    {
        value: 'holiday',
        label: 'Resmi Tatil',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarOff$3e$__["CalendarOff"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
            lineNumber: 57,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        color: 'amber',
        description: 'Resmi tatil günü'
    }
];
// Tarih aralığındaki tüm günleri al (hafta sonlarını hariç tut)
function getDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while(current <= end){
        const dayOfWeek = current.getDay();
        // Hafta sonlarını hariç tut (0 = Pazar, 6 = Cumartesi)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            dates.push(current.toISOString().split('T')[0]);
        }
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
function ManualEntryModal({ isOpen, onClose, onSuccess, users, selectedDate }) {
    _s();
    const [selectedUser, setSelectedUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(selectedDate);
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(selectedDate);
    const [isDateRange, setIsDateRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recordType, setRecordType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('leave');
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // Kaç gün seçildiğini hesapla
    const selectedDays = isDateRange ? getDateRange(startDate, endDate).length : 1;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!selectedUser || !startDate || !recordType) return;
        setSaving(true);
        setError(null);
        setProgress('');
        try {
            const dates = isDateRange ? getDateRange(startDate, endDate) : [
                startDate
            ];
            if (dates.length === 0) {
                throw new Error('Seçilen tarih aralığında iş günü bulunamadı');
            }
            let successCount = 0;
            for (const date of dates){
                setProgress(`${successCount + 1}/${dates.length} kayıt işleniyor...`);
                // O tarihte kayıt var mı kontrol et
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existing } = await supabase.from('attendance').select('id').eq('user_id', selectedUser).eq('date', date).single();
                if (existing && existing.id) {
                    // Güncelle
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { error: updateError } = await supabase.from('attendance').update({
                        record_type: recordType,
                        admin_notes: notes || null,
                        status: recordType === 'remote' ? 'remote' : recordType === 'leave' ? 'leave' : recordType === 'holiday' ? 'holiday' : 'normal',
                        check_in_location_type: recordType === 'remote' ? 'home' : null,
                        updated_at: new Date().toISOString()
                    }).eq('id', existing.id);
                    if (updateError) throw updateError;
                } else {
                    // Yeni kayıt oluştur
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { error: insertError } = await supabase.from('attendance').insert({
                        user_id: selectedUser,
                        date: date,
                        record_type: recordType,
                        admin_notes: notes || null,
                        status: recordType === 'remote' ? 'remote' : recordType === 'leave' ? 'leave' : recordType === 'holiday' ? 'holiday' : 'normal',
                        check_in_location_type: recordType === 'remote' ? 'home' : null,
                        check_in: recordType === 'remote' ? new Date(`${date}T09:00:00`).toISOString() : null,
                        check_out: recordType === 'remote' ? new Date(`${date}T18:30:00`).toISOString() : null
                    });
                    if (insertError) throw insertError;
                }
                successCount++;
            }
            setProgress(`${successCount} kayıt başarıyla oluşturuldu!`);
            setTimeout(()=>{
                onSuccess();
                handleClose();
            }, 1000);
        } catch (err) {
            console.error('Manual entry error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Kayıt eklenirken hata oluştu';
            setError(errorMessage);
            setProgress('');
        } finally{
            setSaving(false);
        }
    };
    const handleClose = ()=>{
        setSelectedUser('');
        setStartDate(selectedDate);
        setEndDate(selectedDate);
        setIsDateRange(false);
        setRecordType('leave');
        setNotes('');
        setError(null);
        setProgress('');
        onClose();
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-5 border-b border-zinc-800 sticky top-0 bg-zinc-900",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 rounded-lg bg-indigo-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-5 h-5 text-indigo-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-zinc-100",
                                            children: "Manuel Kayıt"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 202,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-zinc-500",
                                            children: "İzin, rapor veya evden çalışma kaydı ekleyin"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            className: "p-2 hover:bg-zinc-800 rounded-lg transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5 text-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-5 space-y-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this),
                                        "Personel"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    value: selectedUser,
                                    onValueChange: setSelectedUser,
                                    required: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "w-full bg-zinc-800 border-zinc-700 text-zinc-100 text-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Personel seçin..."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 223,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: user.id,
                                                    children: user.full_name || user.email
                                                }, user.id, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setIsDateRange(!isDateRange),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm", isDateRange ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__["CalendarRange"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this),
                                        "Tarih Aralığı"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this),
                                isDateRange && selectedDays > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-zinc-500",
                                    children: [
                                        selectedDays,
                                        " iş günü seçildi"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-3", isDateRange ? "grid-cols-2" : "grid-cols-1"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this),
                                                isDateRange ? 'Başlangıç' : 'Tarih'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: startDate,
                                            onChange: (e)=>{
                                                setStartDate(e.target.value);
                                                if (!isDateRange || e.target.value > endDate) {
                                                    setEndDate(e.target.value);
                                                }
                                            },
                                            className: "w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                isDateRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 19
                                                }, this),
                                                "Bitiş"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 280,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: endDate,
                                            min: startDate,
                                            onChange: (e)=>setEndDate(e.target.value),
                                            className: "w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-zinc-400 mb-3 block",
                                    children: "Kayıt Tipi"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: RECORD_TYPES.map((type)=>{
                                        const isSelected = recordType === type.value;
                                        const colorClasses = {
                                            emerald: isSelected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'hover:bg-emerald-500/10 hover:border-emerald-500/30',
                                            rose: isSelected ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'hover:bg-rose-500/10 hover:border-rose-500/30',
                                            blue: isSelected ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'hover:bg-blue-500/10 hover:border-blue-500/30',
                                            amber: isSelected ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'hover:bg-amber-500/10 hover:border-amber-500/30'
                                        };
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setRecordType(type.value),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 p-3 rounded-xl border transition-all text-left", isSelected ? colorClasses[type.color] : `bg-zinc-800/50 border-zinc-700 text-zinc-400 ${colorClasses[type.color]}`),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-2 rounded-lg", isSelected ? 'bg-white/10' : 'bg-zinc-700/50'),
                                                    children: type.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium", isSelected ? '' : 'text-zinc-300'),
                                                            children: type.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-zinc-500",
                                                            children: type.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, type.value, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 310,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, this),
                                        "Not (Opsiyonel)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: notes,
                                    onChange: (e)=>setNotes(e.target.value),
                                    placeholder: "Ek bilgi ekleyin...",
                                    className: "w-full h-20 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 345,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this),
                        progress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 text-sm",
                            children: progress
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 362,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    onClick: handleClose,
                                    variant: "outline",
                                    className: "flex-1 border-zinc-700 text-zinc-400 hover:bg-zinc-800",
                                    disabled: saving,
                                    children: "İptal"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    disabled: saving || !selectedUser,
                                    className: "flex-1 bg-indigo-600 hover:bg-indigo-700",
                                    children: [
                                        saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-4 h-4 mr-2 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 384,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                            lineNumber: 386,
                                            columnNumber: 17
                                        }, this),
                                        isDateRange ? `${selectedDays} Gün Kaydet` : 'Kaydet'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                                    lineNumber: 378,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
                    lineNumber: 215,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
            lineNumber: 194,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s(ManualEntryModal, "E7dRCv+kNAnVoP837DZQwnnXYKY=");
_c = ManualEntryModal;
var _c;
__turbopack_context__.k.register(_c, "ManualEntryModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminView",
    ()=>AdminView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$time$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$stats$2d$cards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$attendance$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$monthly$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/monthly-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$weekly$2d$trend$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/weekly-trend.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$manual$2d$entry$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function AdminView({ currentTime, selectedDate, selectedMonth, setSelectedMonth, todayRecords, users, allMonthlyRecords, monthlyStats, weeklyTrend, exportLoading, onExport, onRefresh, goToPrevDay, goToNextDay, goToToday }) {
    _s();
    const [showManualModal, setShowManualModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const todayIsHybrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHybridDay"])(new Date(selectedDate));
    const selectedDateObj = new Date(selectedDate);
    const dayName = selectedDateObj.toLocaleDateString('tr-TR', {
        weekday: 'long'
    });
    const formattedDate = selectedDateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const usersWithoutCheckIn = users.filter((u)=>!todayRecords.some((r)=>r.user_id === u.id) && u.role !== 'admin');
    const officeCount = todayRecords.filter((r)=>r.check_in_location_type === 'office' && r.check_in).length;
    const homeCount = todayRecords.filter((r)=>r.check_in_location_type === 'home' && r.check_in).length;
    const notArrivedCount = usersWithoutCheckIn.length;
    // Monthly calculations
    const adminTotalWorkMinutes = allMonthlyRecords.reduce((total, r)=>{
        if (r.check_in && r.check_out) {
            const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime();
            return total + diff / 60000;
        }
        return total;
    }, 0);
    const adminTotalWorkHours = Math.round(adminTotalWorkMinutes / 60);
    const adminWorkDays = allMonthlyRecords.filter((r)=>r.check_in && r.check_out).length;
    const adminAvgMinutes = adminWorkDays > 0 ? Math.round(adminTotalWorkMinutes / adminWorkDays) : 0;
    const adminTotalOvertime = Object.values(monthlyStats).reduce((a, b)=>a + b.overtime, 0);
    const adminTotalLateDays = Object.values(monthlyStats).reduce((a, b)=>a + b.lateDays, 0);
    // Leaderboard
    const usersWithStats = users.map((u)=>({
            ...u,
            overtime: monthlyStats[u.id]?.overtime || 0,
            lateDays: monthlyStats[u.id]?.lateDays || 0
        }));
    const topWorkers = [
        ...usersWithStats
    ].sort((a, b)=>b.overtime - a.overtime).slice(0, 3);
    const topLate = [
        ...usersWithStats
    ].sort((a, b)=>b.lateDays - a.lateDays).slice(0, 3).filter((u)=>u.lateDays > 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white",
                                children: "Giriş / Çıkış Takibi"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500 mt-1",
                                children: "Personel mesai takibi ve analizler"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onExport,
                        disabled: exportLoading,
                        className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-all",
                        style: {
                            background: 'linear-gradient(90deg, #059669 0%, #0d9488 100%)',
                            boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)'
                        },
                        children: [
                            exportLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-4 h-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 112,
                                columnNumber: 28
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 112,
                                columnNumber: 75
                            }, this),
                            "Excel İndir"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl p-4",
                style: {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$time$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeHeader"], {
                            currentTime: currentTime,
                            formattedDate: formattedDate,
                            dayName: dayName,
                            isHybridDay: todayIsHybrid,
                            variant: "admin"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 text-sm",
                                    style: {
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 129,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "month",
                                            value: selectedMonth,
                                            onChange: (e)=>setSelectedMonth(e.target.value),
                                            className: "bg-transparent border-none text-zinc-100 text-sm focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowManualModal(true),
                                    className: "flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-lg transition-all",
                                    style: {
                                        background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                                        boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 142,
                                            columnNumber: 15
                                        }, this),
                                        "Manuel Kayıt"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$stats$2d$cards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCards"], {
                totalUsers: users.length,
                officeCount: officeCount,
                homeCount: homeCount,
                notArrivedCount: notArrivedCount
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-2 space-y-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl overflow-hidden",
                            style: {
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between px-5 py-4 border-b border-white/5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                    className: "w-5 h-5 text-indigo-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: goToPrevDay,
                                                            className: "p-1.5 rounded-lg transition-all hover:bg-white/10",
                                                            style: {
                                                                background: 'rgba(255,255,255,0.05)',
                                                                border: '1px solid rgba(255,255,255,0.1)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                                className: "w-4 h-4 text-zinc-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                                                            style: {
                                                                background: 'rgba(255,255,255,0.05)',
                                                                border: '1px solid rgba(255,255,255,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: "w-4 h-4 text-indigo-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                                    lineNumber: 169,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-white",
                                                                    children: formattedDate
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-zinc-500",
                                                                    children: dayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: goToNextDay,
                                                            className: "p-1.5 rounded-lg transition-all hover:bg-white/10",
                                                            style: {
                                                                background: 'rgba(255,255,255,0.05)',
                                                                border: '1px solid rgba(255,255,255,0.1)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                className: "w-4 h-4 text-zinc-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                                lineNumber: 174,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 19
                                                        }, this),
                                                        !isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: goToToday,
                                                            className: "ml-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:bg-indigo-500/30",
                                                            style: {
                                                                background: 'rgba(99,102,241,0.2)',
                                                                border: '1px solid rgba(99,102,241,0.3)',
                                                                color: '#818cf8'
                                                            },
                                                            children: "Bugün"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-zinc-500",
                                            children: [
                                                todayRecords.filter((r)=>r.check_in).length,
                                                " / ",
                                                users.length,
                                                " kişi giriş yaptı"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "divide-y divide-white/5",
                                    children: [
                                        todayRecords.map((record)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$attendance$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttendanceRow"], {
                                                record: record,
                                                isHybridDay: todayIsHybrid
                                            }, record.id, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this)),
                                        usersWithoutCheckIn.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$attendance$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyAttendanceRow"], {
                                                userName: user.full_name || 'Bilinmeyen',
                                                userInitial: user.full_name?.charAt(0) || '?'
                                            }, user.id, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this)),
                                        todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 text-center text-zinc-500",
                                            children: "Kayıt bulunamadı"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$monthly$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonthlySummary"], {
                                totalWorkHours: adminTotalWorkHours,
                                avgMinutes: adminAvgMinutes,
                                totalOvertime: adminTotalOvertime,
                                totalLateDays: adminTotalLateDays,
                                isAdmin: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Leaderboard"], {
                                topWorkers: topWorkers,
                                topLate: topLate
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$weekly$2d$trend$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeeklyTrend"], {
                                data: weeklyTrend
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$manual$2d$entry$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ManualEntryModal"], {
                isOpen: showManualModal,
                onClose: ()=>setShowManualModal(false),
                onSuccess: onRefresh,
                users: users,
                selectedDate: selectedDate
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(AdminView, "lgXbPdkThTurMw4/yfF3QnBPUKg=");
_c = AdminView;
var _c;
__turbopack_context__.k.register(_c, "AdminView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StaffView",
    ()=>StaffView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$time$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$history$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/leaderboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$my$2d$status$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/my-status-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$late$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/late-reason-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$overtime$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/overtime-reason-modal.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
function StaffView({ currentTime, selectedDate, myRecord, myHistory, users, monthlyStats, actionLoading, hasCheckedIn, hasCheckedOut, showLateModal, setShowLateModal, lateReason, setLateReason, pendingCheckIn, setPendingCheckIn, showOvertimeModal, setShowOvertimeModal, overtimeReason, setOvertimeReason, pendingCheckOut, setPendingCheckOut, onCheckIn, onCheckOut, onSaveLateCheckIn, onSaveOvertimeCheckOut }) {
    const todayIsHybrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHybridDay"])(new Date(selectedDate));
    const selectedDateObj = new Date(selectedDate);
    const dayName = selectedDateObj.toLocaleDateString('tr-TR', {
        weekday: 'long'
    });
    const formattedDate = selectedDateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    // My stats
    const myWorkRecords = myHistory.filter((r)=>r.check_in && r.check_out && r.record_type === 'normal');
    const myTotalWorkMinutes = myWorkRecords.reduce((total, r)=>{
        if (r.check_in && r.check_out) {
            const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime();
            return total + diff / 60000;
        }
        return total;
    }, 0);
    const myTotalWorkHours = Math.round(myTotalWorkMinutes / 60);
    const myWorkDays = myWorkRecords.length;
    const myAvgMinutes = myWorkDays > 0 ? Math.round(myTotalWorkMinutes / myWorkDays) : 0;
    const myTotalOvertime = myHistory.reduce((a, r)=>a + (r.overtime_minutes || 0), 0);
    const myLateDays = myHistory.filter((r)=>(r.late_minutes ?? 0) > 0).length;
    const myLeaveDays = myHistory.filter((r)=>r.record_type === 'leave').length;
    // Leaderboard
    const usersWithStats = users.map((u)=>({
            ...u,
            overtime: monthlyStats[u.id]?.overtime || 0,
            lateDays: monthlyStats[u.id]?.lateDays || 0
        }));
    const topWorkers = [
        ...usersWithStats
    ].sort((a, b)=>b.overtime - a.overtime).slice(0, 3);
    const topLate = [
        ...usersWithStats
    ].sort((a, b)=>b.lateDays - a.lateDays).slice(0, 3).filter((u)=>u.lateDays > 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Giriş / Çıkış Takibi"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500 mt-1",
                        children: "Mesai kayıtlarım"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-2 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$time$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimeHeader"], {
                                currentTime: currentTime,
                                formattedDate: formattedDate,
                                dayName: dayName,
                                isHybridDay: todayIsHybrid,
                                variant: "staff"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl overflow-hidden",
                                style: {
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between px-5 py-4 border-b border-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                        className: "w-5 h-5 text-cyan-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-white",
                                                        children: "Geçmiş Kayıtlarım"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 124,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-zinc-500",
                                                children: "Son 30 gün"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 128,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "divide-y divide-white/5",
                                        children: myHistory.length > 0 ? myHistory.slice(0, 10).map((record)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$history$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HistoryRow"], {
                                                record: record
                                            }, record.id, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 text-center text-zinc-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                    className: "w-8 h-8 mx-auto mb-2 opacity-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Henüz kayıt bulunmuyor"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$my$2d$status$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyStatusCard"], {
                                myRecord: myRecord,
                                actionLoading: actionLoading,
                                hasCheckedIn: hasCheckedIn,
                                hasCheckedOut: hasCheckedOut,
                                onCheckIn: onCheckIn,
                                onCheckOut: onCheckOut
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl p-5",
                                style: {
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                className: "w-5 h-5 text-indigo-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 157,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-white",
                                                children: "Bu Ay Özetim"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "Çalışma Günü"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-white",
                                                        children: [
                                                            myWorkDays,
                                                            " gün"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 161,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "Toplam Çalışma"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-white font-semibold",
                                                        children: [
                                                            myTotalWorkHours,
                                                            " saat"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 165,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "Ortalama / Gün"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-white",
                                                        children: [
                                                            Math.floor(myAvgMinutes / 60),
                                                            "s ",
                                                            myAvgMinutes % 60,
                                                            "d"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 169,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "Mesai"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-emerald-400",
                                                        children: [
                                                            "+",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMinutes"])(myTotalOvertime) || '0d'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 173,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "Geç Kalma"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-rose-400",
                                                        children: [
                                                            myLateDays,
                                                            " gün"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 177,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-zinc-400",
                                                        children: "İzin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-mono text-cyan-400",
                                                        children: [
                                                            myLeaveDays,
                                                            " gün"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                                lineNumber: 181,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$leaderboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Leaderboard"], {
                                topWorkers: topWorkers,
                                topLate: topLate,
                                showBadge: true
                            }, void 0, false, {
                                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            showLateModal && pendingCheckIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$late$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LateReasonModal"], {
                pendingCheckIn: pendingCheckIn,
                lateReason: lateReason,
                setLateReason: setLateReason,
                onCancel: ()=>{
                    setShowLateModal(false);
                    setPendingCheckIn(null);
                    setLateReason('');
                },
                onSave: onSaveLateCheckIn
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this),
            showOvertimeModal && pendingCheckOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$overtime$2d$reason$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OvertimeReasonModal"], {
                pendingCheckOut: pendingCheckOut,
                overtimeReason: overtimeReason,
                setOvertimeReason: setOvertimeReason,
                onCancel: ()=>{
                    setShowOvertimeModal(false);
                    setPendingCheckOut(null);
                    setOvertimeReason('');
                },
                onSave: onSaveOvertimeCheckOut
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
                lineNumber: 207,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c = StaffView;
var _c;
__turbopack_context__.k.register(_c, "StaffView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Main components
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$time$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/time-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$stats$2d$cards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/stats-cards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$attendance$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/attendance-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$history$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/history-row.tsx [app-client] (ecmascript)");
// Sidebar components
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$sidebar$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/sidebar/index.ts [app-client] (ecmascript) <locals>");
// Modals
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$modals$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/modals/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$manual$2d$entry$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/manual-entry-modal.tsx [app-client] (ecmascript)");
// Views
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$admin$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$staff$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GirisCikisPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/notifications.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$admin$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/admin-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$staff$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/components/staff-view.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function GirisCikisPage() {
    _s();
    const { appUser, isAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [todayRecords, setTodayRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [myHistory, setMyHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allMonthlyRecords, setAllMonthlyRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exportLoading, setExportLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "GirisCikisPage.useState": ()=>{
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
    }["GirisCikisPage.useState"]);
    const [showLateModal, setShowLateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lateReason, setLateReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pendingCheckIn, setPendingCheckIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showOvertimeModal, setShowOvertimeModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [overtimeReason, setOvertimeReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pendingCheckOut, setPendingCheckOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [monthlyStats, setMonthlyStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [weeklyTrend, setWeeklyTrend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // Clock timer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GirisCikisPage.useEffect": ()=>{
            const timer = setInterval({
                "GirisCikisPage.useEffect.timer": ()=>setCurrentTime(new Date())
            }["GirisCikisPage.useEffect.timer"], 1000);
            return ({
                "GirisCikisPage.useEffect": ()=>clearInterval(timer)
            })["GirisCikisPage.useEffect"];
        }
    }["GirisCikisPage.useEffect"], []);
    // Fetch data on date/month change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GirisCikisPage.useEffect": ()=>{
            fetchData();
        }
    }["GirisCikisPage.useEffect"], [
        selectedDate,
        selectedMonth
    ]);
    const fetchData = async ()=>{
        if (!appUser) return;
        setLoading(true);
        try {
            if (isAdmin) {
                const { data: usersData } = await supabase.from('users').select('*').eq('is_active', true).neq('role', 'admin').order('full_name');
                if (usersData) setUsers(usersData);
                const { data: recordsData } = await supabase.from('attendance').select('*, user:users(*)').eq('date', selectedDate).order('check_in', {
                    ascending: true
                });
                if (recordsData) setTodayRecords(recordsData.filter((r)=>r.user?.role !== 'admin'));
                const [year, month] = selectedMonth.split('-').map(Number);
                const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
                const endDate = new Date(year, month, 0).toISOString().split('T')[0];
                const { data: monthData } = await supabase.from('attendance').select('*').gte('date', startDate).lte('date', endDate);
                if (monthData) {
                    setAllMonthlyRecords(monthData);
                    const stats = {};
                    monthData.forEach((r)=>{
                        if (!stats[r.user_id]) stats[r.user_id] = {
                            overtime: 0,
                            late: 0,
                            lateDays: 0
                        };
                        stats[r.user_id].overtime += r.overtime_minutes || 0;
                        stats[r.user_id].late += r.late_minutes || 0;
                        if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1;
                    });
                    setMonthlyStats(stats);
                    // Weekly trend calculation
                    const dayTotals = {
                        1: {
                            total: 0,
                            count: 0
                        },
                        2: {
                            total: 0,
                            count: 0
                        },
                        3: {
                            total: 0,
                            count: 0
                        },
                        4: {
                            total: 0,
                            count: 0
                        },
                        5: {
                            total: 0,
                            count: 0
                        }
                    };
                    monthData.forEach((r)=>{
                        if (r.check_in && r.check_out) {
                            const dayOfWeek = new Date(r.date).getDay();
                            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                                const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime();
                                dayTotals[dayOfWeek].total += diff / 3600000;
                                dayTotals[dayOfWeek].count += 1;
                            }
                        }
                    });
                    const dayNames = [
                        '',
                        'Pazartesi',
                        'Salı',
                        'Çarşamba',
                        'Perşembe',
                        'Cuma'
                    ];
                    setWeeklyTrend([
                        1,
                        2,
                        3,
                        4,
                        5
                    ].map((d)=>({
                            day: dayNames[d],
                            hours: dayTotals[d].count > 0 ? Math.round(dayTotals[d].total / dayTotals[d].count) : 0
                        })));
                }
            } else {
                // Staff view
                const { data: todayData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).eq('date', selectedDate).single();
                setTodayRecords(todayData ? [
                    todayData
                ] : []);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const { data: historyData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).order('date', {
                    ascending: false
                });
                if (historyData) setMyHistory(historyData);
                // Leaderboard data
                const { data: allUsersData } = await supabase.from('users').select('*').eq('is_active', true).neq('role', 'admin').order('full_name');
                if (allUsersData) setUsers(allUsersData);
                const now = new Date();
                const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
                const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                const { data: monthData } = await supabase.from('attendance').select('user_id, overtime_minutes, late_minutes').gte('date', startDate).lte('date', endDate);
                if (monthData) {
                    const stats = {};
                    monthData.forEach((r)=>{
                        if (!stats[r.user_id]) stats[r.user_id] = {
                            overtime: 0,
                            late: 0,
                            lateDays: 0
                        };
                        stats[r.user_id].overtime += r.overtime_minutes || 0;
                        stats[r.user_id].late += r.late_minutes || 0;
                        if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1;
                    });
                    setMonthlyStats(stats);
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally{
            setLoading(false);
        }
    };
    // Excel export handler
    const handleExportExcel = async ()=>{
        if (!isAdmin) return;
        setExportLoading(true);
        try {
            const [year, month] = selectedMonth.split('-').map(Number);
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];
            const { data: records, error } = await supabase.from('attendance').select('*, user:users(full_name, email, role)').gte('date', startDate).lte('date', endDate).order('date', {
                ascending: true
            }).order('user_id', {
                ascending: true
            });
            if (error) throw error;
            const filteredRecords = records?.filter((r)=>r.user?.role !== 'admin') || [];
            if (filteredRecords.length === 0) {
                alert('Bu ay için kayıt bulunamadı.');
                setExportLoading(false);
                return;
            }
            const mainData = filteredRecords.map((record)=>{
                const date = new Date(record.date);
                const dayName = date.toLocaleDateString('tr-TR', {
                    weekday: 'long'
                });
                const formattedDate = date.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                const checkIn = record.check_in ? new Date(record.check_in).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '-';
                const checkOut = record.check_out ? new Date(record.check_out).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '-';
                let duration = '-';
                if (record.check_in && record.check_out) {
                    const diff = new Date(record.check_out).getTime() - new Date(record.check_in).getTime();
                    duration = `${Math.floor(diff / 3600000)}s ${Math.floor(diff % 3600000 / 60000)}d`;
                }
                const locationType = record.check_in_location_type === 'office' ? 'Ofis' : record.check_in_location_type === 'home' ? 'Evden' : record.check_in_location_type === 'other' ? 'Dışarı' : '-';
                const recordTypeLabels = {
                    normal: 'Normal',
                    leave: 'İzin',
                    sick: 'Rapor',
                    remote: 'Evden Çalışma',
                    holiday: 'Tatil'
                };
                const status = record.record_type && record.record_type !== 'normal' ? recordTypeLabels[record.record_type] || '-' : record.status === 'late' ? 'Geç' : record.status === 'early_leave' ? 'Erken Çıkış' : record.status === 'normal' ? 'Normal' : '-';
                return {
                    'Personel': record.user?.full_name || '-',
                    'Tarih': formattedDate,
                    'Gün': dayName,
                    'Giriş': checkIn,
                    'Çıkış': checkOut,
                    'Geç (dk)': record.late_minutes || 0,
                    'Mesai (dk)': record.overtime_minutes || 0,
                    'Erken Çıkış (dk)': record.early_leave_minutes || 0,
                    'Toplam Süre': duration,
                    'Konum': locationType,
                    'Durum': status,
                    'Geç Sebebi': record.late_reason || '',
                    'Mesai Sebebi': record.overtime_reason || '',
                    'Admin Notu': record.admin_notes || ''
                };
            });
            const summary = {};
            filteredRecords.forEach((record)=>{
                const name = record.user?.full_name || 'Bilinmeyen';
                if (!summary[name]) summary[name] = {
                    late: 0,
                    overtime: 0,
                    earlyLeave: 0,
                    days: 0,
                    leave: 0,
                    sick: 0,
                    remote: 0
                };
                summary[name].late += record.late_minutes || 0;
                summary[name].overtime += record.overtime_minutes || 0;
                summary[name].earlyLeave += record.early_leave_minutes || 0;
                summary[name].days += 1;
                if (record.record_type === 'leave') summary[name].leave += 1;
                if (record.record_type === 'sick') summary[name].sick += 1;
                if (record.record_type === 'remote') summary[name].remote += 1;
            });
            const summaryData = Object.entries(summary).map(([name, data])=>({
                    'Personel': name,
                    'Toplam Gün': data.days,
                    'İzin Günü': data.leave,
                    'Rapor Günü': data.sick,
                    'Evden Çalışma': data.remote,
                    'Toplam Geç (dk)': data.late,
                    'Toplam Mesai (dk)': data.overtime,
                    'Toplam Erken Çıkış (dk)': data.earlyLeave
                }));
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            const wsMain = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mainData);
            wsMain['!cols'] = [
                {
                    wch: 20
                },
                {
                    wch: 18
                },
                {
                    wch: 12
                },
                {
                    wch: 8
                },
                {
                    wch: 8
                },
                {
                    wch: 10
                },
                {
                    wch: 10
                },
                {
                    wch: 15
                },
                {
                    wch: 12
                },
                {
                    wch: 10
                },
                {
                    wch: 15
                },
                {
                    wch: 30
                },
                {
                    wch: 30
                },
                {
                    wch: 30
                }
            ];
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, wsMain, 'Detay');
            const wsSummary = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(summaryData);
            wsSummary['!cols'] = [
                {
                    wch: 20
                },
                {
                    wch: 12
                },
                {
                    wch: 10
                },
                {
                    wch: 12
                },
                {
                    wch: 15
                },
                {
                    wch: 15
                },
                {
                    wch: 15
                },
                {
                    wch: 20
                }
            ];
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, wsSummary, 'Özet');
            const monthNames = [
                'Ocak',
                'Şubat',
                'Mart',
                'Nisan',
                'Mayıs',
                'Haziran',
                'Temmuz',
                'Ağustos',
                'Eylül',
                'Ekim',
                'Kasım',
                'Aralık'
            ];
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `Mesai-Raporu-${monthNames[month - 1]}-${year}.xlsx`);
        } catch (error) {
            console.error('Export error:', error);
            alert('Excel oluşturulurken hata oluştu.');
        } finally{
            setExportLoading(false);
        }
    };
    // Check-in/out handlers
    const myRecord = todayRecords.find((r)=>r.user_id === appUser?.id);
    const hasCheckedIn = myRecord?.check_in != null;
    const hasCheckedOut = myRecord?.check_out != null;
    const handleCheckIn = async ()=>{
        if (!appUser || isAdmin) return;
        setActionLoading(true);
        try {
            const now = new Date();
            const location = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocation"])();
            const lateMinutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateLateMinutes"])(now);
            if (lateMinutes > 0) {
                setPendingCheckIn({
                    now,
                    location,
                    lateMinutes
                });
                setShowLateModal(true);
                setActionLoading(false);
                return;
            }
            await saveCheckIn(now, location, 0, '');
        } catch (error) {
            console.error('Check-in error:', error);
            setActionLoading(false);
        }
    };
    const saveCheckIn = async (now, location, lateMinutes, reason)=>{
        const today = now.toISOString().split('T')[0];
        const todayIsHybrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHybridDay"])(now);
        let locationType;
        if (location) {
            const isInOffice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocationType"])(location.lat, location.lng) === 'office';
            if (isInOffice) {
                locationType = 'office';
            } else if (todayIsHybrid) {
                locationType = 'home';
            } else {
                locationType = 'other';
            }
        } else {
            locationType = todayIsHybrid ? 'home' : 'unknown';
        }
        const status = lateMinutes > 0 ? 'late' : 'normal';
        const checkInData = {
            user_id: appUser.id,
            date: today,
            check_in: now.toISOString(),
            late_minutes: lateMinutes,
            status,
            check_in_location_type: locationType,
            late_reason: reason || null,
            record_type: 'normal'
        };
        if (location) {
            checkInData.check_in_lat = location.lat;
            checkInData.check_in_lng = location.lng;
        }
        if (myRecord) {
            await supabase.from('attendance').update({
                ...checkInData,
                updated_at: now.toISOString()
            }).eq('id', myRecord.id);
        } else {
            await supabase.from('attendance').insert(checkInData);
        }
        if (lateMinutes > 0 && appUser) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyAdmins"])(supabase, {
                type: 'late',
                title: `${appUser.full_name} geç kaldı`,
                message: `${lateMinutes} dakika geç giriş. Sebep: ${reason || 'Belirtilmedi'}`,
                related_user_id: appUser.id
            });
        }
        setShowLateModal(false);
        setLateReason('');
        setPendingCheckIn(null);
        setActionLoading(false);
        fetchData();
    };
    const handleCheckOut = async ()=>{
        if (!appUser || !myRecord || isAdmin) return;
        setActionLoading(true);
        try {
            const now = new Date();
            const location = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocation"])();
            const overtimeMinutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateOvertimeMinutes"])(now);
            const earlyLeaveMinutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateEarlyLeaveMinutes"])(now);
            if (overtimeMinutes > 0) {
                setPendingCheckOut({
                    now,
                    location,
                    overtimeMinutes,
                    earlyLeaveMinutes
                });
                setShowOvertimeModal(true);
                setActionLoading(false);
                return;
            }
            await saveCheckOut(now, location, 0, earlyLeaveMinutes, '');
        } catch (error) {
            console.error('Check-out error:', error);
            setActionLoading(false);
        }
    };
    const saveCheckOut = async (now, location, overtimeMinutes, earlyLeaveMinutes, reason)=>{
        const todayIsHybrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHybridDay"])(now);
        let locationType;
        if (location) {
            const isInOffice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocationType"])(location.lat, location.lng) === 'office';
            if (isInOffice) {
                locationType = 'office';
            } else if (todayIsHybrid) {
                locationType = 'home';
            } else {
                locationType = 'other';
            }
        } else {
            locationType = todayIsHybrid ? 'home' : 'unknown';
        }
        let status = myRecord.status || 'normal';
        if (earlyLeaveMinutes > 0) status = 'early_leave';
        const checkOutData = {
            check_out: now.toISOString(),
            overtime_minutes: overtimeMinutes,
            early_leave_minutes: earlyLeaveMinutes,
            check_out_location_type: locationType,
            status,
            overtime_reason: reason || null,
            updated_at: now.toISOString()
        };
        if (location) {
            checkOutData.check_out_lat = location.lat;
            checkOutData.check_out_lng = location.lng;
        }
        await supabase.from('attendance').update(checkOutData).eq('id', myRecord.id);
        if (overtimeMinutes > 0 && appUser) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyAdmins"])(supabase, {
                type: 'overtime',
                title: `${appUser.full_name} mesai yaptı`,
                message: `${overtimeMinutes} dakika mesai. Sebep: ${reason || 'Belirtilmedi'}`,
                related_user_id: appUser.id
            });
        }
        if (earlyLeaveMinutes > 15 && appUser) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyAdmins"])(supabase, {
                type: 'early_leave',
                title: `${appUser.full_name} erken çıktı`,
                message: `${earlyLeaveMinutes} dakika erken çıkış.`,
                related_user_id: appUser.id
            });
        }
        setShowOvertimeModal(false);
        setOvertimeReason('');
        setPendingCheckOut(null);
        setActionLoading(false);
        fetchData();
    };
    // Navigation helpers
    const goToPrevDay = ()=>{
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };
    const goToNextDay = ()=>{
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d.toISOString().split('T')[0]);
    };
    const goToToday = ()=>setSelectedDate(new Date().toISOString().split('T')[0]);
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-8 h-8 animate-spin text-indigo-500"
            }, void 0, false, {
                fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/page.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/page.tsx",
            lineNumber: 278,
            columnNumber: 7
        }, this);
    }
    // Render appropriate view
    if (isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$admin$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminView"], {
            currentTime: currentTime,
            selectedDate: selectedDate,
            selectedMonth: selectedMonth,
            setSelectedMonth: setSelectedMonth,
            todayRecords: todayRecords,
            users: users,
            allMonthlyRecords: allMonthlyRecords,
            monthlyStats: monthlyStats,
            weeklyTrend: weeklyTrend,
            exportLoading: exportLoading,
            onExport: handleExportExcel,
            onRefresh: fetchData,
            goToPrevDay: goToPrevDay,
            goToNextDay: goToNextDay,
            goToToday: goToToday
        }, void 0, false, {
            fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/page.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$giris$2d$cikis$2f$components$2f$staff$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StaffView"], {
        currentTime: currentTime,
        selectedDate: selectedDate,
        myRecord: myRecord,
        myHistory: myHistory,
        users: users,
        monthlyStats: monthlyStats,
        actionLoading: actionLoading,
        hasCheckedIn: hasCheckedIn,
        hasCheckedOut: hasCheckedOut,
        showLateModal: showLateModal,
        setShowLateModal: setShowLateModal,
        lateReason: lateReason,
        setLateReason: setLateReason,
        pendingCheckIn: pendingCheckIn,
        setPendingCheckIn: setPendingCheckIn,
        showOvertimeModal: showOvertimeModal,
        setShowOvertimeModal: setShowOvertimeModal,
        overtimeReason: overtimeReason,
        setOvertimeReason: setOvertimeReason,
        pendingCheckOut: pendingCheckOut,
        setPendingCheckOut: setPendingCheckOut,
        onCheckIn: handleCheckIn,
        onCheckOut: handleCheckOut,
        onSaveLateCheckIn: ()=>{
            if (!lateReason.trim() || !pendingCheckIn) return;
            saveCheckIn(pendingCheckIn.now, pendingCheckIn.location, pendingCheckIn.lateMinutes, lateReason.trim());
        },
        onSaveOvertimeCheckOut: ()=>{
            if (!overtimeReason.trim() || !pendingCheckOut) return;
            saveCheckOut(pendingCheckOut.now, pendingCheckOut.location, pendingCheckOut.overtimeMinutes, pendingCheckOut.earlyLeaveMinutes, overtimeReason.trim());
        }
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/giris-cikis/page.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
_s(GirisCikisPage, "ey6blOlBjpFUm6mxlL2hQwoE9ec=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = GirisCikisPage;
var _c;
__turbopack_context__.k.register(_c, "GirisCikisPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_ajans-bee-platform_src_956bce5e._.js.map