export interface ThemeColors {
    primary: string;
    primaryFocus: string;
    primaryContent: string;
    secondary: string;
    secondaryFocus: string;
    secondaryContent: string;
    accent: string;
    accentFocus: string;
    accentContent: string;
    neutral: string;
    neutralFocus: string;
    neutralContent: string;
    base100: string;
    base200: string;
    base300: string;
    baseContent: string;
    info: string;
    infoContent: string;
    success: string;
    successContent: string;
    warning: string;
    warningContent: string;
    error: string;
    errorContent: string;
}

export interface ThemeUtilities {
    roundedBox: string;
    roundedBtn: string;
    roundedBadge: string;
    animationBtn: string;
    animationInput: string;
    btnFocusScale: string;
    borderBtn: string;
    tabBorder: string;
    tabRadius: string;
    tab: {
        tabBorder: string;
        tabBorderColor: string;
        tabPadding: string;
        tabBg: string;
        tabRadius: string;
        tabCornerBg: string;
        circlePos: string;
        tabGrad: string;
    };
    countdown: {
        value: string;
    };
    radialProgress: {
        value: string;
        size: string;
        thickness: string;
    };
    tooltip: {
        tooltipColor: string;
        tooltipTextColor: string;
        tooltipOffset: string;
        tooltipTail: string;
        tooltipTailOffset: string;
    };
    checkbox: {
        chkbg: string;
        chkfg: string;
    };
    toggle: {
        tglbg: string;
        handleOffset: string;
    };
    range: {
        fillerSize: string;
        fillerOffset: string;
        rangeShdw: string;
    };
    glass: {
        glassBlur: string;
        glassOpacity: string;
        glassBorderOpacity: string;
        glassReflexDegree: string;
        glassReflexOpacity: string;
        glassTextShadowOpacity: string;
    };
}

export function extractThemeColorsFromDOM(): ThemeColors {
    const computedStyles = getComputedStyle(document.querySelector(":root")!);
    return {
        primary: `oklch(${computedStyles.getPropertyValue("--p")})`,
        primaryFocus: `oklch(${computedStyles.getPropertyValue("--pf")})`,
        primaryContent: `oklch(${computedStyles.getPropertyValue("--pc")})`,
        secondary: `oklch(${computedStyles.getPropertyValue("--s")})`,
        secondaryFocus: `oklch(${computedStyles.getPropertyValue("--sf")})`,
        secondaryContent: `oklch(${computedStyles.getPropertyValue("--sc")})`,
        accent: `oklch(${computedStyles.getPropertyValue("--a")})`,
        accentFocus: `oklch(${computedStyles.getPropertyValue("--af")})`,
        accentContent: `oklch(${computedStyles.getPropertyValue("--ac")})`,
        neutral: `oklch(${computedStyles.getPropertyValue("--n")})`,
        neutralFocus: `oklch(${computedStyles.getPropertyValue("--nf")})`,
        neutralContent: `oklch(${computedStyles.getPropertyValue("--nc")})`,
        base100: `oklch(${computedStyles.getPropertyValue("--b1")})`,
        base200: `oklch(${computedStyles.getPropertyValue("--b2")})`,
        base300: `oklch(${computedStyles.getPropertyValue("--b3")})`,
        baseContent: `oklch(${computedStyles.getPropertyValue("--bc")})`,
        info: `oklch(${computedStyles.getPropertyValue("--in")})`,
        infoContent: `oklch(${computedStyles.getPropertyValue("--inc")})`,
        success: `oklch(${computedStyles.getPropertyValue("--su")})`,
        successContent: `oklch(${computedStyles.getPropertyValue("--suc")})`,
        warning: `oklch(${computedStyles.getPropertyValue("--wa")})`,
        warningContent: `oklch(${computedStyles.getPropertyValue("--wac")})`,
        error: `oklch(${computedStyles.getPropertyValue("--er")})`,
        errorContent: `oklch(${computedStyles.getPropertyValue("--erc")})`,
    };
}

export function extractThemeUtilitiesFromDOM(): ThemeUtilities {
    const computedStyles = getComputedStyle(document.querySelector(":root")!);

    return {
        roundedBox: computedStyles.getPropertyValue("--rounded-box"),
        roundedBtn: computedStyles.getPropertyValue("--rounded-btn"),
        roundedBadge: computedStyles.getPropertyValue("--rounded-badge"),
        animationBtn: computedStyles.getPropertyValue("--animation-btn"),
        animationInput: computedStyles.getPropertyValue("--animation-input"),
        btnFocusScale: computedStyles.getPropertyValue("--btn-focus-scale"),
        borderBtn: computedStyles.getPropertyValue("--border-btn"),
        tabBorder: computedStyles.getPropertyValue("--tab-border"),
        tabRadius: computedStyles.getPropertyValue("--tab-radius"),
        tab: {
            tabBorder: computedStyles.getPropertyValue("--tab-tab-border"),
            tabBorderColor: computedStyles.getPropertyValue("--tab-tab-border-color"),
            tabPadding: computedStyles.getPropertyValue("--tab-tab-padding"),
            tabBg: computedStyles.getPropertyValue("--tab-tab-bg"),
            tabRadius: computedStyles.getPropertyValue("--tab-tab-radius"),
            tabCornerBg: computedStyles.getPropertyValue("--tab-tab-corner-bg"),
            circlePos: computedStyles.getPropertyValue("--tab-circle-pos"),
            tabGrad: computedStyles.getPropertyValue("--tab-tab-grad"),
        },
        countdown: {
            value: computedStyles.getPropertyValue("--countdown-value"),
        },
        radialProgress: {
            value: computedStyles.getPropertyValue("--radial-progress-value"),
            size: computedStyles.getPropertyValue("--radial-progress-size"),
            thickness: computedStyles.getPropertyValue("--radial-progress-thickness"),
        },
        tooltip: {
            tooltipColor: computedStyles.getPropertyValue("--tooltip-tooltip-color"),
            tooltipTextColor: computedStyles.getPropertyValue("--tooltip-tooltip-text-color"),
            tooltipOffset: computedStyles.getPropertyValue("--tooltip-tooltip-offset"),
            tooltipTail: computedStyles.getPropertyValue("--tooltip-tooltip-tail"),
            tooltipTailOffset: computedStyles.getPropertyValue("--tooltip-tooltip-tail-offset"),
        },
        checkbox: {
            chkbg: computedStyles.getPropertyValue("--checkbox-chkbg"),
            chkfg: computedStyles.getPropertyValue("--checkbox-chkfg"),
        },
        toggle: {
            tglbg: computedStyles.getPropertyValue("--toggle-tglbg"),
            handleOffset: computedStyles.getPropertyValue("--toggle-handleoffset"),
        },
        range: {
            fillerSize: computedStyles.getPropertyValue("--range-filler-size"),
            fillerOffset: computedStyles.getPropertyValue("--range-filler-offset"),
            rangeShdw: computedStyles.getPropertyValue("--range-range-shdw"),
        },
        glass: {
            glassBlur: computedStyles.getPropertyValue("--glass-glass-blur"),
            glassOpacity: computedStyles.getPropertyValue("--glass-glass-opacity"),
            glassBorderOpacity: computedStyles.getPropertyValue("--glass-glass-border-opacity"),
            glassReflexDegree: computedStyles.getPropertyValue("--glass-glass-reflex-degree"),
            glassReflexOpacity: computedStyles.getPropertyValue("--glass-glass-reflex-opacity"),
            glassTextShadowOpacity: computedStyles.getPropertyValue(
                "--glass-glass-text-shadow-opacity"
            ),
        },
    };
}

export function remToPx(rem: string) {
    const re = /(\d+)rem/;
    const pxPerRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const match = rem.match(re);
    if (!match || match[1] === undefined) return null;
    const remNum = parseFloat(match[1]);
    return remNum * pxPerRem;
}
