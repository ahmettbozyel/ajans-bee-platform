module.exports = [
"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4031db28220d4685ee7dbe6a55d32a4e18622b27fe":"createUser","403d55a6de6b81c8a0c116aad0e1f6b2a2e254dfdf":"deleteUser","60f364d87ee7149ac8e95af200ae4f9b3bd1018f83":"updateUser"},"",""] */ __turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "deleteUser",
    ()=>deleteUser,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://ycqgynakmefpjsyfchew.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
async function createUser(data) {
    try {
        // 1. Auth'da kullanıcı oluştur (trigger otomatik public.users'a ekleyecek)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: {
                full_name: data.full_name
            }
        });
        if (authError) {
            return {
                success: false,
                error: authError.message
            };
        }
        // 2. Trigger zaten ekledi, sadece role ve full_name güncelle
        const { error: updateError } = await supabaseAdmin.from('users').update({
            full_name: data.full_name,
            role: data.role
        }).eq('id', authData.user.id);
        if (updateError) {
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            user: authData.user
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}
async function updateUser(userId, data) {
    try {
        const { error } = await supabaseAdmin.from('users').update({
            ...data,
            updated_at: new Date().toISOString()
        }).eq('id', userId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}
async function deleteUser(userId) {
    try {
        // 1. Public tablodan sil
        const { error: deleteError } = await supabaseAdmin.from('users').delete().eq('id', userId);
        if (deleteError) {
            return {
                success: false,
                error: deleteError.message
            };
        }
        // 2. Auth'dan sil
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (authError) {
            return {
                success: false,
                error: authError.message
            };
        }
        return {
            success: true
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createUser,
    updateUser,
    deleteUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUser, "4031db28220d4685ee7dbe6a55d32a4e18622b27fe", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUser, "60f364d87ee7149ac8e95af200ae4f9b3bd1018f83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteUser, "403d55a6de6b81c8a0c116aad0e1f6b2a2e254dfdf", null);
}),
"[project]/Desktop/ajans-bee-platform/.next-internal/server/app/(dashboard)/ayarlar/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$ayarlar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/Desktop/ajans-bee-platform/.next-internal/server/app/(dashboard)/ayarlar/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4031db28220d4685ee7dbe6a55d32a4e18622b27fe",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$ayarlar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUser"],
    "60f364d87ee7149ac8e95af200ae4f9b3bd1018f83",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$ayarlar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$ayarlar$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$ayarlar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/ajans-bee-platform/.next-internal/server/app/(dashboard)/ayarlar/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$ajans$2d$bee$2d$platform$2f$src$2f$app$2f28$dashboard$292f$ayarlar$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/ajans-bee-platform/src/app/(dashboard)/ayarlar/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_ajans-bee-platform_963e35d5._.js.map