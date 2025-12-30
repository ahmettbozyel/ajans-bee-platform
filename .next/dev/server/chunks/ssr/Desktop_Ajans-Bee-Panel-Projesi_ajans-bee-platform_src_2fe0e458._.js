module.exports = [
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/button.tsx",
        lineNumber: 47,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base text-zinc-900 dark:text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = "Input";
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/label.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/@radix-ui/react-label/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/label.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/switch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/@radix-ui/react-switch/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const Switch = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
        ...props,
        ref: ref,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Thumb"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")
        }, void 0, false, {
            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/switch.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/switch.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Switch.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/popover.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/@radix-ui/react-popover/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const PopoverContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, align = "center", sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/popover.tsx",
            lineNumber: 17,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/popover.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
PopoverContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Command",
    ()=>Command,
    "CommandDialog",
    ()=>CommandDialog,
    "CommandEmpty",
    ()=>CommandEmpty,
    "CommandGroup",
    ()=>CommandGroup,
    "CommandInput",
    ()=>CommandInput,
    "CommandItem",
    ()=>CommandItem,
    "CommandList",
    ()=>CommandList,
    "CommandSeparator",
    ()=>CommandSeparator,
    "CommandShortcut",
    ()=>CommandShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/cmdk/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const Command = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Command.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].displayName;
const CommandDialog = ({ children, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "overflow-hidden p-0 shadow-lg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Command, {
                className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const CommandInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center border-b border-zinc-700 px-3",
        "cmdk-input-wrapper": "",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "mr-2 h-4 w-4 shrink-0 opacity-50"
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
                lineNumber: 43,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Input, {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
                lineNumber: 44,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandInput.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Input.displayName;
const CommandList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].List, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 61,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].List.displayName;
const CommandEmpty = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Empty, {
        ref: ref,
        className: "py-6 text-center text-sm",
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandEmpty.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Empty.displayName;
const CommandGroup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Group, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 87,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandGroup.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Group.displayName;
const CommandSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Separator, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("-mx-1 h-px bg-border", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Separator.displayName;
const CommandItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Item, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CommandItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"].Item.displayName;
const CommandShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
CommandShortcut.displayName = "CommandShortcut";
;
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/local-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Local storage utilities for recent customers
__turbopack_context__.s([
    "addToRecentCustomers",
    ()=>addToRecentCustomers,
    "clearRecentCustomers",
    ()=>clearRecentCustomers,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "getLastCustomerId",
    ()=>getLastCustomerId,
    "getRecentCustomers",
    ()=>getRecentCustomers,
    "removeFromRecentCustomers",
    ()=>removeFromRecentCustomers,
    "setLastCustomerId",
    ()=>setLastCustomerId
]);
const STORAGE_KEY = 'recent_customers';
const LAST_CUSTOMER_KEY = 'last_customer_id';
const MAX_RECENT = 5;
function getRecentCustomers() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function addToRecentCustomers(customer) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function removeFromRecentCustomers(customerId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearRecentCustomers() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getLastCustomerId() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function setLastCustomerId(customerId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return new Date(timestamp).toLocaleDateString('tr-TR');
}
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/customer-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// Customer Types - Genişletilmiş Brief Sistemi
// Version: 2.5 - Fatura İletişim Bilgileri Eklendi
// =====================================================
// Sosyal medya platform tipi
__turbopack_context__.s([
    "BRAND_VOICES",
    ()=>BRAND_VOICES,
    "BRIEF_SECTIONS",
    ()=>BRIEF_SECTIONS,
    "BRIEF_SECTIONS_NEW",
    ()=>BRIEF_SECTIONS_NEW,
    "BUSINESS_TYPES",
    ()=>BUSINESS_TYPES,
    "CUSTOMER_STATUSES",
    ()=>CUSTOMER_STATUSES,
    "CUSTOMER_TYPES",
    ()=>CUSTOMER_TYPES,
    "EMPTY_STATE_MESSAGES",
    ()=>EMPTY_STATE_MESSAGES,
    "FILE_CATEGORIES",
    ()=>FILE_CATEGORIES,
    "LOGO_CATEGORIES",
    ()=>LOGO_CATEGORIES,
    "PAYMENT_STATUSES",
    ()=>PAYMENT_STATUSES,
    "PRICE_SEGMENTS",
    ()=>PRICE_SEGMENTS,
    "SECTORS",
    ()=>SECTORS,
    "SERVICE_TYPES",
    ()=>SERVICE_TYPES,
    "SERVICE_TYPE_COLORS",
    ()=>SERVICE_TYPE_COLORS,
    "calculateBriefCompletion",
    ()=>calculateBriefCompletion,
    "calculateSectionCompletion",
    ()=>calculateSectionCompletion,
    "getCustomerStatusLabel",
    ()=>getCustomerStatusLabel,
    "getCustomerTypeLabel",
    ()=>getCustomerTypeLabel,
    "getProgressColor",
    ()=>getProgressColor,
    "getProgressTextColor",
    ()=>getProgressTextColor,
    "getServiceTypeColors",
    ()=>getServiceTypeColors
]);
const LOGO_CATEGORIES = [
    {
        value: 'primary',
        label: 'Ana Logo',
        description: 'Renkli, tam versiyon'
    },
    {
        value: 'white',
        label: 'Tek Renk (Beyaz)',
        description: 'Dark arka plan için'
    },
    {
        value: 'black',
        label: 'Tek Renk (Siyah)',
        description: 'Light arka plan için'
    },
    {
        value: 'icon',
        label: 'İkon/Favicon',
        description: 'Sadece sembol'
    },
    {
        value: 'vertical',
        label: 'Dikey',
        description: 'Dikey layout'
    },
    {
        value: 'horizontal',
        label: 'Yatay',
        description: 'Yatay layout'
    }
];
const FILE_CATEGORIES = [
    {
        value: 'logo',
        label: 'Logolar',
        icon: 'Image',
        description: 'Tüm logo varyasyonları'
    },
    {
        value: 'product',
        label: 'Ürün Görselleri',
        icon: 'Package',
        description: 'Ürün fotoğrafları'
    },
    {
        value: 'post',
        label: 'Örnek Postlar',
        icon: 'FileImage',
        description: 'Beğenilen içerik örnekleri'
    }
];
const SERVICE_TYPE_COLORS = {
    hosting: {
        bg: 'bg-cyan-100 dark:bg-cyan-500/20',
        text: 'text-cyan-700 dark:text-cyan-400',
        glow: 'glow-cyan'
    },
    domain: {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        glow: 'glow-amber'
    },
    ssl: {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        glow: 'glow-emerald'
    },
    email: {
        bg: 'bg-violet-100 dark:bg-violet-500/20',
        text: 'text-violet-700 dark:text-violet-400',
        glow: 'glow-violet'
    }
};
const SERVICE_TYPES = [
    {
        value: 'hosting',
        label: 'Hosting',
        icon: 'Server'
    },
    {
        value: 'domain',
        label: 'Domain',
        icon: 'Globe'
    },
    {
        value: 'ssl',
        label: 'SSL',
        icon: 'ShieldCheck'
    },
    {
        value: 'email',
        label: 'E-posta',
        icon: 'Mail'
    }
];
const PAYMENT_STATUSES = [
    {
        value: 'pending',
        label: 'Bekliyor'
    },
    {
        value: 'paid',
        label: 'Ödendi'
    },
    {
        value: 'overdue',
        label: 'Gecikmiş'
    },
    {
        value: 'cancelled',
        label: 'İptal'
    }
];
const CUSTOMER_TYPES = [
    {
        value: 'retainer',
        label: 'Retainer',
        description: 'Aylık düzenli hizmet',
        icon: '🔄'
    },
    {
        value: 'project',
        label: 'Proje',
        description: 'Proje bazlı hizmet',
        icon: '📁'
    }
];
const CUSTOMER_STATUSES = [
    {
        value: 'active',
        label: 'Aktif',
        description: 'Aktif müşteri',
        icon: '✅'
    },
    {
        value: 'inactive',
        label: 'Pasif',
        description: 'İş bitti, teknik hizmet devam',
        icon: '⏸️'
    }
];
const BRIEF_SECTIONS_NEW = {
    markaKimligi: {
        id: 'marka-kimligi',
        label: 'Marka Kimliği',
        icon: 'Sparkles',
        fields: [
            'name',
            'customer_type',
            'status',
            'website_url',
            'sector',
            'sub_sector',
            'business_type',
            'brand_voice',
            'social_media',
            'brand_description',
            'mission',
            'vision',
            'slogan',
            'usp'
        ],
        required: [
            'name',
            'customer_type'
        ]
    },
    hedefKitle: {
        id: 'hedef-kitle',
        label: 'Hedef Kitle',
        icon: 'Users',
        fields: [
            'target_audience',
            'target_age_range',
            'target_geography'
        ],
        required: []
    },
    urunHizmet: {
        id: 'urun-hizmet',
        label: 'Ürün/Hizmet',
        icon: 'Package',
        fields: [
            'product_categories',
            'top_products',
            'price_segment'
        ],
        required: []
    },
    rakipler: {
        id: 'rakipler',
        label: 'Rakipler',
        icon: 'Target',
        fields: [
            'competitors'
        ],
        required: []
    },
    kurallar: {
        id: 'kurallar',
        label: 'İçerik Kuralları',
        icon: 'ShieldCheck',
        fields: [
            'do_not_do',
            'must_emphasize'
        ],
        required: []
    },
    ozelGunler: {
        id: 'ozel-gunler',
        label: 'Özel Günler',
        icon: 'Calendar',
        fields: [
            'special_events'
        ],
        required: []
    },
    faturaIletisim: {
        id: 'fatura-iletisim',
        label: 'Fatura İletişim',
        icon: 'Receipt',
        fields: [
            'billing_contact_name',
            'billing_contact_email',
            'billing_contact_phone'
        ],
        required: []
    }
};
const BRIEF_SECTIONS = {
    temelBilgiler: {
        id: 'temel',
        label: 'Temel Bilgiler',
        icon: 'Building2',
        fields: [
            'name',
            'customer_type',
            'status',
            'website_url',
            'sector',
            'sub_sector',
            'business_type',
            'brand_voice'
        ],
        required: [
            'name',
            'customer_type'
        ]
    },
    iletisim: {
        id: 'iletisim',
        label: 'İletişim',
        icon: 'Phone',
        fields: [
            'email',
            'phone',
            'location'
        ],
        required: []
    },
    sosyalMedya: {
        id: 'sosyal',
        label: 'Sosyal Medya',
        icon: 'Share2',
        fields: [
            'social_media'
        ],
        required: []
    },
    markaKimligi: {
        id: 'marka',
        label: 'Marka Kimliği',
        icon: 'Sparkles',
        fields: [
            'brand_description',
            'mission',
            'vision',
            'slogan',
            'usp'
        ],
        required: []
    },
    hedefKitle: {
        id: 'hedef',
        label: 'Hedef Kitle',
        icon: 'Users',
        fields: [
            'target_audience',
            'target_age_range',
            'target_geography'
        ],
        required: []
    },
    urunBilgileri: {
        id: 'urun',
        label: 'Ürün Bilgileri',
        icon: 'Package',
        fields: [
            'product_categories',
            'top_products',
            'price_segment'
        ],
        required: []
    },
    rekabet: {
        id: 'rekabet',
        label: 'Rekabet Analizi',
        icon: 'Target',
        fields: [
            'competitors'
        ],
        required: []
    },
    kurallar: {
        id: 'kurallar',
        label: 'İçerik Kuralları',
        icon: 'ShieldCheck',
        fields: [
            'do_not_do',
            'must_emphasize'
        ],
        required: []
    },
    takvim: {
        id: 'takvim',
        label: 'Özel Günler',
        icon: 'Calendar',
        fields: [
            'special_events'
        ],
        required: []
    },
    markaDegerleri: {
        id: 'degerler',
        label: 'Marka Değerleri',
        icon: 'Heart',
        fields: [
            'brand_values',
            'buying_motivations'
        ],
        required: []
    },
    icerikStratejisi: {
        id: 'strateji',
        label: 'İçerik Stratejisi',
        icon: 'Layers',
        fields: [
            'content_pillars'
        ],
        required: []
    },
    platformKurallari: {
        id: 'platform',
        label: 'Platform Kuralları',
        icon: 'Settings',
        fields: [
            'platform_rules'
        ],
        required: []
    },
    ornekIcerikler: {
        id: 'ornekler',
        label: 'Örnek İçerikler',
        icon: 'FileText',
        fields: [
            'example_captions'
        ],
        required: []
    },
    kelimeHaritasi: {
        id: 'kelime',
        label: 'Kelime Haritası',
        icon: 'BookOpen',
        fields: [
            'word_mapping'
        ],
        required: []
    },
    markaGorselleri: {
        id: 'gorseller',
        label: 'Marka Görselleri',
        icon: 'Palette',
        fields: [
            'brand_colors',
            'brand_fonts',
            'brand_assets'
        ],
        required: []
    },
    entegrasyonlar: {
        id: 'entegrasyon',
        label: 'Entegrasyonlar',
        icon: 'Link',
        fields: [
            'integrations'
        ],
        required: []
    },
    aiResearch: {
        id: 'ai-research',
        label: 'AI Araştırma',
        icon: 'Bot',
        fields: [
            'pain_points',
            'hook_sentences',
            'cta_standards',
            'forbidden_words',
            'seasonal_calendar'
        ],
        required: []
    },
    faturaIletisim: {
        id: 'fatura-iletisim',
        label: 'Fatura İletişim',
        icon: 'Receipt',
        fields: [
            'billing_contact_name',
            'billing_contact_email',
            'billing_contact_phone'
        ],
        required: []
    }
};
const SECTORS = [
    // Perakende & Ticaret
    {
        value: 'e-ticaret',
        label: 'E-Ticaret'
    },
    {
        value: 'perakende',
        label: 'Perakende'
    },
    {
        value: 'toptan',
        label: 'Toptan Ticaret'
    },
    // Gıda & İçecek
    {
        value: 'gida',
        label: 'Gıda & İçecek'
    },
    {
        value: 'restoran',
        label: 'Restoran & Kafe'
    },
    {
        value: 'catering',
        label: 'Catering & Organizasyon'
    },
    // Moda & Güzellik
    {
        value: 'tekstil',
        label: 'Tekstil & Moda'
    },
    {
        value: 'kozmetik',
        label: 'Kozmetik & Güzellik'
    },
    {
        value: 'kuyumculuk',
        label: 'Kuyumculuk & Aksesuar'
    },
    {
        value: 'ayakkabi',
        label: 'Ayakkabı & Çanta'
    },
    // Sağlık
    {
        value: 'saglik',
        label: 'Sağlık & Medikal'
    },
    {
        value: 'eczane',
        label: 'Eczane'
    },
    {
        value: 'dis',
        label: 'Diş Hekimliği'
    },
    {
        value: 'estetik',
        label: 'Estetik & Plastik Cerrahi'
    },
    {
        value: 'psikoloji',
        label: 'Psikoloji & Terapi'
    },
    {
        value: 'veteriner',
        label: 'Veterinerlik'
    },
    {
        value: 'spor-fitness',
        label: 'Spor & Fitness'
    },
    // Teknoloji & Yazılım
    {
        value: 'teknoloji',
        label: 'Teknoloji'
    },
    {
        value: 'yazilim',
        label: 'Yazılım & SaaS'
    },
    {
        value: 'ajans',
        label: 'Dijital Ajans'
    },
    {
        value: 'danismanlik-it',
        label: 'IT Danışmanlık'
    },
    // Eğitim
    {
        value: 'egitim',
        label: 'Eğitim'
    },
    {
        value: 'kurs',
        label: 'Kurs & Eğitim Merkezi'
    },
    {
        value: 'universite',
        label: 'Üniversite & Okul'
    },
    {
        value: 'cocuk',
        label: 'Çocuk Eğitimi'
    },
    // Finans & Hukuk
    {
        value: 'finans',
        label: 'Finans & Bankacılık'
    },
    {
        value: 'sigorta',
        label: 'Sigorta'
    },
    {
        value: 'muhasebe',
        label: 'Muhasebe & Mali Müşavirlik'
    },
    {
        value: 'hukuk',
        label: 'Hukuk & Avukatlık'
    },
    // Gayrimenkul & İnşaat
    {
        value: 'gayrimenkul',
        label: 'Gayrimenkul'
    },
    {
        value: 'insaat',
        label: 'İnşaat'
    },
    {
        value: 'mimarlik',
        label: 'Mimarlık & İç Tasarım'
    },
    {
        value: 'dekorasyon',
        label: 'Dekorasyon & Mobilya'
    },
    // Turizm & Konaklama
    {
        value: 'turizm',
        label: 'Turizm & Seyahat'
    },
    {
        value: 'otel',
        label: 'Otel & Konaklama'
    },
    {
        value: 'transfer',
        label: 'Transfer & Araç Kiralama'
    },
    // Otomotiv & Ulaşım
    {
        value: 'otomotiv',
        label: 'Otomotiv'
    },
    {
        value: 'oto-servis',
        label: 'Oto Servis & Yedek Parça'
    },
    {
        value: 'lojistik',
        label: 'Lojistik & Kargo'
    },
    // Enerji & Çevre
    {
        value: 'enerji',
        label: 'Enerji'
    },
    {
        value: 'yenilenebilir',
        label: 'Yenilenebilir Enerji'
    },
    {
        value: 'cevre',
        label: 'Çevre & Geri Dönüşüm'
    },
    // Üretim & Sanayi
    {
        value: 'uretim',
        label: 'Üretim & Sanayi'
    },
    {
        value: 'makine',
        label: 'Makine & Ekipman'
    },
    {
        value: 'kimya',
        label: 'Kimya & Plastik'
    },
    {
        value: 'ambalaj',
        label: 'Ambalaj'
    },
    // Tarım & Hayvancılık
    {
        value: 'tarim',
        label: 'Tarım'
    },
    {
        value: 'hayvancilik',
        label: 'Hayvancılık'
    },
    {
        value: 'organik',
        label: 'Organik Ürünler'
    },
    // Medya & Eğlence
    {
        value: 'medya',
        label: 'Medya & Yayıncılık'
    },
    {
        value: 'eglence',
        label: 'Eğlence & Etkinlik'
    },
    {
        value: 'muzik',
        label: 'Müzik & Sanat'
    },
    {
        value: 'oyun',
        label: 'Oyun & E-Spor'
    },
    // Hizmet
    {
        value: 'danismanlik',
        label: 'Danışmanlık'
    },
    {
        value: 'temizlik',
        label: 'Temizlik Hizmetleri'
    },
    {
        value: 'guvenlik',
        label: 'Güvenlik'
    },
    {
        value: 'hr',
        label: 'İnsan Kaynakları'
    },
    {
        value: 'fotograf',
        label: 'Fotoğraf & Video'
    },
    // STK & Kamu
    {
        value: 'stk',
        label: 'STK & Vakıf'
    },
    {
        value: 'kamu',
        label: 'Kamu & Belediye'
    },
    // Diğer
    {
        value: 'diger',
        label: 'Diğer'
    }
];
const BRAND_VOICES = [
    {
        value: 'samimi',
        label: 'Samimi',
        emoji: '🤝',
        icon: '🤝',
        description: 'Arkadaşça, sıcak'
    },
    {
        value: 'profesyonel',
        label: 'Profesyonel',
        emoji: '💼',
        icon: '💼',
        description: 'Ciddi, iş odaklı'
    },
    {
        value: 'kurumsal',
        label: 'Kurumsal',
        emoji: '🏢',
        icon: '🏢',
        description: 'Formal, resmi'
    },
    {
        value: 'enerjik',
        label: 'Enerjik',
        emoji: '⚡',
        icon: '⚡',
        description: 'Dinamik, heyecanlı'
    }
];
const BUSINESS_TYPES = [
    {
        value: 'B2B',
        label: 'B2B',
        description: 'İşletmeden işletmeye'
    },
    {
        value: 'B2C',
        label: 'B2C',
        description: 'İşletmeden tüketiciye'
    },
    {
        value: 'Both',
        label: 'Her İkisi',
        description: 'Hem B2B hem B2C'
    }
];
const PRICE_SEGMENTS = [
    {
        value: 'ekonomik',
        label: 'Ekonomik'
    },
    {
        value: 'orta',
        label: 'Orta Segment'
    },
    {
        value: 'premium',
        label: 'Premium'
    },
    {
        value: 'luks',
        label: 'Lüks'
    }
];
const EMPTY_STATE_MESSAGES = {
    dashboard_activity: "Henüz aktivite yok. İlk içeriği üretmek için bir marka seç! 🚀",
    files: "Henüz dosya yüklenmedi. Logo ve görselleri buraya yükle.",
    calendar: "Takvim boş. İçerik planlamaya başla!",
    content: "Henüz içerik üretilmedi. Hemen başla! ✨",
    performance: "Performans raporları çok yakında burada! 📊",
    brands: "Henüz marka eklenmedi. İlk markanı ekleyerek başla! 🐝"
};
function calculateBriefCompletion(customer) {
    const checkField = (value)=>{
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    };
    const allFields = [
        'name',
        'customer_type',
        'status',
        'website_url',
        'sector',
        'sub_sector',
        'business_type',
        'brand_voice',
        'email',
        'phone',
        'location',
        'social_media',
        'brand_description',
        'mission',
        'vision',
        'slogan',
        'usp',
        'target_audience',
        'target_age_range',
        'target_geography',
        'product_categories',
        'top_products',
        'price_segment',
        'competitors',
        'do_not_do',
        'must_emphasize',
        'special_events',
        'brand_values',
        'buying_motivations',
        'content_pillars',
        'platform_rules',
        'example_captions',
        'word_mapping',
        'brand_colors',
        'brand_fonts',
        'brand_assets',
        'integrations',
        'pain_points',
        'hook_sentences',
        'cta_standards',
        'forbidden_words',
        'seasonal_calendar',
        'billing_contact_name',
        'billing_contact_email',
        'billing_contact_phone'
    ];
    const filledFields = allFields.filter((field)=>checkField(customer[field]));
    return Math.round(filledFields.length / allFields.length * 100);
}
function calculateSectionCompletion(customer, fields) {
    const checkField = (value)=>{
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    };
    const filledFields = fields.filter((field)=>checkField(customer[field]));
    return fields.length > 0 ? Math.round(filledFields.length / fields.length * 100) : 0;
}
function getCustomerTypeLabel(type) {
    const found = CUSTOMER_TYPES.find((t)=>t.value === type);
    return found?.label || type;
}
function getCustomerStatusLabel(status) {
    const found = CUSTOMER_STATUSES.find((s)=>s.value === status);
    return found?.label || status;
}
function getServiceTypeColors(type) {
    return SERVICE_TYPE_COLORS[type] || SERVICE_TYPE_COLORS.hosting;
}
function getProgressColor(value) {
    if (value >= 100) return 'progress-emerald';
    if (value >= 71) return 'progress-cyan';
    if (value >= 31) return 'progress-amber';
    return 'progress-rose';
}
function getProgressTextColor(value) {
    if (value >= 100) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 71) return 'text-cyan-600 dark:text-cyan-400';
    if (value >= 31) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
}
}),
"[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MusterilerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/switch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/popover.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/components/ui/command.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-ssr] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/circle-pause.js [app-ssr] (ecmascript) <export default as PauseCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-ssr] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$local$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/local-storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$customer$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/customer-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/lib/utils.ts [app-ssr] (ecmascript)");
// @ts-nocheck
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function getSectorLabel(value) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$customer$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECTORS"].find((s)=>s.value === value)?.label || value;
}
// Progress bar rengi
function getProgressColor(value) {
    if (value >= 100) return {
        bar: 'from-emerald-500 to-teal-500',
        text: 'text-emerald-600 dark:text-emerald-400'
    };
    if (value >= 71) return {
        bar: 'from-cyan-500 to-blue-500',
        text: 'text-cyan-600 dark:text-cyan-400'
    };
    if (value >= 31) return {
        bar: 'from-amber-500 to-orange-500',
        text: 'text-amber-600 dark:text-amber-400'
    };
    return {
        bar: 'from-rose-500 to-pink-500',
        text: 'text-rose-600 dark:text-rose-400'
    };
}
// Marka kartı için gradient renk paletleri
const cardGradients = [
    {
        bg: 'from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20',
        border: 'border-violet-200 dark:border-violet-500/20',
        icon: 'text-violet-600 dark:text-violet-400'
    },
    {
        bg: 'from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/20',
        border: 'border-amber-200 dark:border-amber-500/20',
        icon: 'text-amber-600 dark:text-amber-400'
    },
    {
        bg: 'from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/20',
        border: 'border-rose-200 dark:border-rose-500/20',
        icon: 'text-rose-600 dark:text-rose-400'
    },
    {
        bg: 'from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20',
        border: 'border-cyan-200 dark:border-cyan-500/20',
        icon: 'text-cyan-600 dark:text-cyan-400'
    },
    {
        bg: 'from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        icon: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        bg: 'from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/20',
        border: 'border-indigo-200 dark:border-indigo-500/20',
        icon: 'text-indigo-600 dark:text-indigo-400'
    }
];
// Yeni marka formu için initial state
const initialNewBrandForm = {
    name: '',
    website_url: '',
    customer_type: 'project',
    sector: ''
};
function MusterilerPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recentCustomers, setRecentCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [newBrandDialogOpen, setNewBrandDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customerToDelete, setCustomerToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formLoading, setFormLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showInactive, setShowInactive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newBrandForm, setNewBrandForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialNewBrandForm);
    const [sectorPopoverOpen, setSectorPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchCustomers();
        setRecentCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$local$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRecentCustomers"])());
    }, []);
    async function fetchCustomers() {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('customers').select('*').order('created_at', {
                ascending: false
            });
            if (error) throw error;
            setCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally{
            setLoading(false);
        }
    }
    const filteredCustomers = customers.filter((customer)=>{
        const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) || customer.sector?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = showInactive || customer.status !== 'inactive';
        return matchesSearch && matchesStatus;
    });
    const inactiveCount = customers.filter((c)=>c.status === 'inactive').length;
    const activeCount = customers.filter((c)=>c.status !== 'inactive').length;
    function handleCustomerClick(customer) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$local$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addToRecentCustomers"])({
            id: customer.id,
            name: customer.name,
            sector: customer.sector || ''
        });
        setRecentCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$local$2d$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRecentCustomers"])());
        router.push(`/customers/${customer.id}`);
    }
    function handleNewBrandDialogOpen() {
        setNewBrandForm(initialNewBrandForm);
        setNewBrandDialogOpen(true);
    }
    async function handleCreateBrand() {
        if (!newBrandForm.name.trim()) return;
        setFormLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');
            const customerData = {
                name: newBrandForm.name.trim(),
                website_url: newBrandForm.website_url.trim() || null,
                customer_type: newBrandForm.customer_type,
                sector: newBrandForm.sector || null,
                status: 'active',
                user_id: user.id,
                // Diğer alanlar boş/default
                brand_name: null,
                sub_sector: null,
                business_type: null,
                brand_voice: null,
                email: null,
                phone: null,
                location: null,
                social_media: {},
                brand_description: null,
                mission: null,
                vision: null,
                slogan: null,
                usp: null,
                target_audience: null,
                target_age_range: null,
                target_geography: null,
                product_categories: [],
                top_products: [],
                price_segment: null,
                competitors: [],
                do_not_do: [],
                must_emphasize: [],
                special_events: [],
                brand_values: [],
                buying_motivations: [],
                content_pillars: [],
                platform_rules: {},
                example_captions: {},
                word_mapping: [],
                brand_colors: {},
                brand_fonts: {},
                brand_assets: {},
                integrations: {}
            };
            const { data, error } = await supabase.from('customers').insert(customerData).select().single();
            if (error) throw error;
            setNewBrandDialogOpen(false);
            if (data) {
                router.push(`/customers/${data.id}`);
            } else {
                fetchCustomers();
            }
        } catch (error) {
            console.error('Error creating brand:', error);
        } finally{
            setFormLoading(false);
        }
    }
    async function handleDeleteCustomer() {
        if (!customerToDelete) return;
        try {
            const { error } = await supabase.from('customers').delete().eq('id', customerToDelete.id);
            if (error) throw error;
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: handleNewBrandDialogOpen,
                    className: "btn-press px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this),
                        "Yeni Marka"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-card rounded-2xl p-5 glow-indigo card-hover",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 w-fit mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                    className: "w-6 h-6 text-indigo-600 dark:text-indigo-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-zinc-900 dark:text-white mb-1",
                                children: customers.length
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500",
                                children: "Toplam Marka"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-card rounded-2xl p-5 glow-emerald card-hover",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 w-fit mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    className: "w-6 h-6 text-emerald-600 dark:text-emerald-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-zinc-900 dark:text-white mb-1",
                                children: activeCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500",
                                children: "Aktif"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-card rounded-2xl p-5 glow-amber card-hover",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 w-fit mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__["PauseCircle"], {
                                    className: "w-6 h-6 text-amber-600 dark:text-amber-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-zinc-900 dark:text-white mb-1",
                                children: inactiveCount
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500",
                                children: "Pasif"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-card rounded-2xl p-5 glow-violet card-hover",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-6 h-6 text-violet-600 dark:text-violet-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold text-zinc-900 dark:text-white mb-1",
                                children: "0"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500",
                                children: "İçerik Üretildi"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-card rounded-2xl p-4 border border-zinc-200 dark:border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                    placeholder: "Marka ara...",
                                    className: "pl-10 input-glow bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this),
                        inactiveCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Switch"], {
                                    id: "show-inactive",
                                    checked: showInactive,
                                    onCheckedChange: setShowInactive
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "show-inactive",
                                    className: "text-sm cursor-pointer flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400",
                                    children: [
                                        showInactive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 282,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 282,
                                            columnNumber: 63
                                        }, this),
                                        "Pasif (",
                                        inactiveCount,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                    lineNumber: 263,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-base font-semibold text-zinc-900 dark:text-white",
                children: [
                    showInactive ? 'Tüm Markalar' : 'Aktif Markalar',
                    " (",
                    filteredCustomers.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-card rounded-2xl p-12 text-center text-zinc-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: "Yükleniyor..."
                }, void 0, false, {
                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                    lineNumber: 298,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 297,
                columnNumber: 9
            }, this) : filteredCustomers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-card rounded-2xl p-12 text-center border border-zinc-200 dark:border-white/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 float-animation",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            className: "w-8 h-8 text-zinc-400"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 303,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-zinc-900 dark:text-white mb-2",
                        children: searchQuery ? 'Marka bulunamadı' : 'Henüz marka eklenmedi'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-500 mb-6",
                        children: searchQuery ? 'Aramanızla eşleşen marka yok.' : 'İlk markayı ekleyerek başla! 🐝'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 308,
                        columnNumber: 11
                    }, this),
                    !searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleNewBrandDialogOpen,
                        className: "btn-press px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "w-4 h-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 316,
                                columnNumber: 15
                            }, this),
                            "İlk Markayı Ekle"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 312,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 301,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
                children: filteredCustomers.map((customer, index)=>{
                    const completion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$customer$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateBriefCompletion"])(customer);
                    const isInactive = customer.status === 'inactive';
                    const colors = getProgressColor(completion);
                    const gradient = cardGradients[index % cardGradients.length];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover cursor-pointer group ${isInactive ? 'opacity-60' : ''}`,
                        onClick: ()=>handleCustomerClick(customer),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-12 w-12 rounded-xl bg-gradient-to-br ${gradient.bg} border ${gradient.border} flex items-center justify-center flex-shrink-0`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            className: `w-6 h-6 ${gradient.icon}`
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 340,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-zinc-900 dark:text-white truncate",
                                                children: customer.name
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 343,
                                                columnNumber: 21
                                            }, this),
                                            customer.website_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-500 font-mono truncate",
                                                children: (()=>{
                                                    try {
                                                        return new URL(customer.website_url).hostname;
                                                    } catch  {
                                                        return customer.website_url;
                                                    }
                                                })()
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    router.push(`/customers/${customer.id}`);
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 356,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    setCustomerToDelete(customer);
                                                    setDeleteDialogOpen(true);
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 367,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 338,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mb-4",
                                children: [
                                    customer.customer_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 font-medium border border-violet-200 dark:border-violet-500/20",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$customer$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCustomerTypeLabel"])(customer.customer_type)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 21
                                    }, this),
                                    customer.sector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                                        children: getSectorLabel(customer.sector)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 390,
                                        columnNumber: 21
                                    }, this),
                                    isInactive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500",
                                        children: "Pasif"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 383,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between mb-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-zinc-500",
                                                children: "Brief"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 404,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs font-mono font-semibold ${colors.text}`,
                                                children: [
                                                    "%",
                                                    completion
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 405,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 403,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-2 rounded-full bg-zinc-200 dark:bg-white/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-500`,
                                            style: {
                                                width: `${completion}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 408,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                        lineNumber: 407,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                lineNumber: 402,
                                columnNumber: 17
                            }, this)
                        ]
                    }, customer.id, true, {
                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                        lineNumber: 330,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 322,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: newBrandDialogOpen,
                onOpenChange: setNewBrandDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-md border border-zinc-700 rounded-2xl shadow-2xl",
                    style: {
                        backgroundColor: '#18181b'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "text-xl font-bold text-white flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "w-5 h-5 text-indigo-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 429,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 428,
                                            columnNumber: 15
                                        }, this),
                                        "Yeni Marka Ekle"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 427,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    className: "text-zinc-400",
                                    children: "Temel bilgileri gir, detayları sonra Brief'ten doldurursun."
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 426,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "brand-name",
                                            className: "text-sm font-medium text-zinc-300",
                                            children: [
                                                "Marka Adı ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-rose-500",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 441,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "brand-name",
                                            placeholder: "Örn: AJANS BEE",
                                            value: newBrandForm.name,
                                            onChange: (e)=>setNewBrandForm((prev)=>({
                                                        ...prev,
                                                        name: e.target.value
                                                    })),
                                            className: "input-glow bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 444,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "website",
                                            className: "text-sm font-medium text-zinc-300",
                                            children: "Website"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 455,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "website",
                                            placeholder: "https://example.com",
                                            value: newBrandForm.website_url,
                                            onChange: (e)=>setNewBrandForm((prev)=>({
                                                        ...prev,
                                                        website_url: e.target.value
                                                    })),
                                            className: "input-glow bg-zinc-800 border-zinc-700 text-white font-mono text-sm placeholder:text-zinc-500"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 454,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm font-medium text-zinc-300",
                                            children: "Müşteri Tipi"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 469,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setNewBrandForm((prev)=>({
                                                                ...prev,
                                                                customer_type: 'retainer'
                                                            })),
                                                    className: `p-3 rounded-xl border-2 transition-all text-center ${newBrandForm.customer_type === 'retainer' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 hover:border-zinc-600'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg mb-1 block",
                                                            children: "🤝"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm font-medium ${newBrandForm.customer_type === 'retainer' ? 'text-emerald-400' : 'text-zinc-300'}`,
                                                            children: "Retainer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                            lineNumber: 483,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 473,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setNewBrandForm((prev)=>({
                                                                ...prev,
                                                                customer_type: 'project'
                                                            })),
                                                    className: `p-3 rounded-xl border-2 transition-all text-center ${newBrandForm.customer_type === 'project' ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 hover:border-zinc-600'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg mb-1 block",
                                                            children: "📋"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                            lineNumber: 498,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm font-medium ${newBrandForm.customer_type === 'project' ? 'text-violet-400' : 'text-zinc-300'}`,
                                                            children: "Proje"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                            lineNumber: 499,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 489,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 472,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 468,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm font-medium text-zinc-300",
                                            children: "Sektör"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 510,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                                            open: sectorPopoverOpen,
                                            onOpenChange: setSectorPopoverOpen,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        role: "combobox",
                                                        "aria-expanded": sectorPopoverOpen,
                                                        className: "w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white",
                                                        children: [
                                                            newBrandForm.sector ? getSectorLabel(newBrandForm.sector) : "Sektör seç...",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                    className: "w-[var(--radix-popover-trigger-width)] p-0 border-zinc-700 shadow-2xl rounded-xl overflow-hidden",
                                                    align: "start",
                                                    style: {
                                                        backgroundColor: '#18181b'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Command"], {
                                                        style: {
                                                            backgroundColor: '#18181b'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                placeholder: "Sektör ara...",
                                                                className: "h-11 border-b border-zinc-700 text-white placeholder:text-zinc-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                lineNumber: 533,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                className: "max-h-64 overflow-auto",
                                                                style: {
                                                                    backgroundColor: '#18181b'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                        className: "py-6 text-center text-sm text-zinc-500",
                                                                        children: "Sektör bulunamadı."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                        lineNumber: 538,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                        style: {
                                                                            backgroundColor: '#18181b'
                                                                        },
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$customer$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECTORS"].map((sector)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                value: sector.label,
                                                                                onSelect: ()=>{
                                                                                    setNewBrandForm((prev)=>({
                                                                                            ...prev,
                                                                                            sector: prev.sector === sector.value ? '' : sector.value
                                                                                        }));
                                                                                    setSectorPopoverOpen(false);
                                                                                },
                                                                                className: "px-3 py-2.5 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800 data-[selected=true]:!bg-zinc-800",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 text-indigo-400", newBrandForm.sector === sector.value ? "opacity-100" : "opacity-0")
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                                        lineNumber: 555,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(newBrandForm.sector === sector.value && "text-indigo-400 font-medium"),
                                                                                        children: sector.label
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                                        lineNumber: 561,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, sector.value, true, {
                                                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                                lineNumber: 543,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                        lineNumber: 541,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                                lineNumber: 537,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 509,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setNewBrandDialogOpen(false),
                                    className: "rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                    children: "İptal"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 577,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleCreateBrand,
                                    disabled: !newBrandForm.name.trim() || formLoading,
                                    className: "btn-press rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25",
                                    children: formLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 mr-2 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 19
                                            }, this),
                                            "Oluşturuluyor..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "w-4 h-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 19
                                            }, this),
                                            "Oluştur"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 584,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 576,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                    lineNumber: 422,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 421,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: deleteDialogOpen,
                onOpenChange: setDeleteDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "border border-zinc-700 rounded-2xl shadow-2xl",
                    style: {
                        backgroundColor: '#18181b'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "text-white",
                                    children: "Markayı Sil"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 612,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    className: "text-zinc-400",
                                    children: [
                                        '"',
                                        customerToDelete?.name,
                                        '" markasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 613,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 611,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setDeleteDialogOpen(false),
                                    className: "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                    children: "İptal"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 619,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Ajans$2d$Bee$2d$Panel$2d$Projesi$2f$ajans$2d$bee$2d$platform$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "destructive",
                                    onClick: handleDeleteCustomer,
                                    children: "Sil"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                                    lineNumber: 626,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                            lineNumber: 618,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                    lineNumber: 607,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
                lineNumber: 606,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Ajans-Bee-Panel-Projesi/ajans-bee-platform/src/app/(dashboard)/musteriler/page.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_Ajans-Bee-Panel-Projesi_ajans-bee-platform_src_2fe0e458._.js.map