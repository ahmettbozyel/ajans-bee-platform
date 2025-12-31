(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/ajans-bee-platform/src/lib/auth-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ==========================================
// RBAC Types - Ajans Bee Platform
// ==========================================
// Roller
__turbopack_context__.s([
    "AVATAR_COLORS",
    ()=>AVATAR_COLORS,
    "CATEGORY_COLORS",
    ()=>CATEGORY_COLORS,
    "ROLE_ACCESS",
    ()=>ROLE_ACCESS,
    "STATUS_STYLES",
    ()=>STATUS_STYLES,
    "canAccess",
    ()=>canAccess,
    "canEdit",
    ()=>canEdit,
    "getDefaultRoute",
    ()=>getDefaultRoute
]);
const ROLE_ACCESS = {
    admin: [
        'dashboard',
        'markalar',
        'teknik-hizmetler',
        'icerik-uret',
        'gunluk-isler',
        'giris-cikis',
        'ayarlar'
    ],
    personel: [
        'gunluk-isler',
        'giris-cikis'
    ],
    operasyon: [
        'gunluk-isler',
        'giris-cikis',
        'teknik-hizmetler'
    ]
};
function canAccess(role, module) {
    if (role === 'admin') return true;
    return ROLE_ACCESS[role]?.includes(module) ?? false;
}
function canEdit(role, module) {
    // Admin her şeyi düzenleyebilir
    if (role === 'admin') return true;
    // Operasyon teknik hizmetleri düzenleyebilir
    if (role === 'operasyon' && module === 'teknik-hizmetler') return true;
    // Herkes kendi günlük işlerini düzenleyebilir
    if (module === 'gunluk-isler' || module === 'giris-cikis') return true;
    return false;
}
function getDefaultRoute(role) {
    switch(role){
        case 'admin':
            return '/dashboard';
        case 'operasyon':
            return '/gunluk-isler';
        case 'personel':
            return '/gunluk-isler';
        default:
            return '/gunluk-isler';
    }
}
const AVATAR_COLORS = {
    'A': 'from-amber-500 to-orange-600',
    'B': 'from-violet-500 to-purple-600',
    'E': 'from-rose-500 to-pink-600',
    'N': 'from-emerald-500 to-teal-600',
    'Ö': 'from-cyan-500 to-blue-600',
    'default': 'from-zinc-500 to-zinc-600'
};
const CATEGORY_COLORS = {
    'tasarim': {
        bg: 'bg-fuchsia-500/20',
        text: 'text-fuchsia-400',
        border: 'border-fuchsia-500/20'
    },
    'video': {
        bg: 'bg-rose-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/20'
    },
    'revize': {
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/20'
    },
    'toplanti': {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
    },
    'arastirma': {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/20'
    },
    'gelistirme': {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20'
    },
    'icerik': {
        bg: 'bg-violet-500/20',
        text: 'text-violet-400',
        border: 'border-violet-500/20'
    },
    'destek': {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/20'
    },
    'genel': {
        bg: 'bg-slate-500/20',
        text: 'text-slate-400',
        border: 'border-slate-500/20'
    }
};
const STATUS_STYLES = {
    'active': {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        icon: 'pulse'
    },
    'paused': {
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        icon: 'pause'
    },
    'completed': {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        icon: 'check-circle'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/ajans-bee-platform/src/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/lib/auth-types.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [authUser, setAuthUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [appUser, setAppUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://ycqgynakmefpjsyfchew.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_QToYz-_I_rvgKEUsS7x3-g_F1L0gWxv"))
    }["AuthProvider.useMemo[supabase]"], []);
    const fetchAppUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[fetchAppUser]": async (userId)=>{
            try {
                console.log('[Auth] Fetching app user...');
                const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
                if (error) {
                    console.error('[Auth] Users error:', error.message);
                    return null;
                }
                console.log('[Auth] Got user:', data?.email);
                return data;
            } catch (err) {
                console.error('[Auth] Exception:', err?.message);
                return null;
            }
        }
    }["AuthProvider.useCallback[fetchAppUser]"], [
        supabase
    ]);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setAuthUser(user);
                const appUserData = await fetchAppUser(user.id);
                setAppUser(appUserData);
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], [
        supabase,
        fetchAppUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const init = {
                "AuthProvider.useEffect.init": async ()=>{
                    console.log('[Auth] Init start');
                    try {
                        // Get current user
                        const { data: { user }, error } = await supabase.auth.getUser();
                        if (error || !user) {
                            console.log('[Auth] No user');
                            setLoading(false);
                            return;
                        }
                        console.log('[Auth] User:', user.email);
                        setAuthUser(user);
                        // Fetch app user data
                        const appUserData = await fetchAppUser(user.id);
                        setAppUser(appUserData);
                        console.log('[Auth] Done');
                        setLoading(false);
                    } catch (err) {
                        console.error('[Auth] Error:', err?.message);
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.init"];
            // Listen only for sign out
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": (event)=>{
                    console.log('[Auth] Event:', event);
                    if (event === 'SIGNED_OUT') {
                        setAuthUser(null);
                        setAppUser(null);
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect"]);
            init();
            return ({
                "AuthProvider.useEffect": ()=>subscription.unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        supabase,
        fetchAppUser
    ]);
    const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signOut]": async ()=>{
            await supabase.auth.signOut();
            setAuthUser(null);
            setAppUser(null);
        }
    }["AuthProvider.useCallback[signOut]"], [
        supabase
    ]);
    const role = appUser?.role ?? null;
    const value = {
        authUser,
        appUser,
        loading,
        role,
        isAdmin: role === 'admin',
        isOperasyon: role === 'operasyon',
        isPersonel: role === 'personel',
        canAccess: (module)=>role ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAccess"])(role, module) : false,
        canEdit: (module)=>role ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canEdit"])(role, module) : false,
        getDefaultRoute: ()=>role ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$auth$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultRoute"])(role) : '/login',
        signOut,
        refreshUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/ajans-bee-platform/src/lib/auth-context.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "Ka0cNfCv9ATQd4hQblplEsv3SXQ=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_ajans-bee-platform_src_lib_95e5c6ec._.js.map