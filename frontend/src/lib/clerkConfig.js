export const clerkAppearance = {
    elements: {
        card: "bg-sidebar border shadow-md rounded-xl",
        headerTitle: "text-2xl font-semibold text-foreground",
        headerSubtitle: "text-sm text-muted-foreground",
        formFieldLabel: "text-sm text-muted-foreground font-medium",
        formFieldInput:
            "bg-muted text-foreground border border-input rounded-md px-3 py-2",
        formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold",
        socialButtonsBlockButton:
            "border border-input bg-muted text-foreground hover:bg-muted/80 px-4 py-2 rounded-md",
        dividerText: "text-muted-foreground text-xs",
        footerActionText: "text-muted-foreground text-sm",
        footerActionLink: "text-primary hover:underline",

        userButtonPopoverCard: "bg-sidebar border shadow-md rounded-xl",
        userButtonPopoverHeader: "text-sm text-muted-foreground",
        userButtonPopoverEmail: "text-sm text-foreground",
        userButtonPopoverUsername: "text-sm text-foreground font-medium",
        userButtonPopoverActionButton:
            "text-foreground hover:bg-muted hover:text-foreground px-3 py-2 text-sm",
        userButtonPopoverActionButtonText: "text-foreground",
        userButtonPopoverFooter: "text-destructive text-xs mt-2",
        userButtonTrigger:
            "rounded-full border ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-ring",
    },
    variables: {
        colorPrimary: "hsl(var(--primary))",
        colorBackground: "hsl(var(--sidebar))",
        colorText: "hsl(var(--foreground))",
        colorInputBackground: "hsl(var(--input))",
        colorInputText: "hsl(var(--foreground))",
        colorInputBorder: "hsl(var(--border))",
        borderRadius: "0.55rem",
    },
};
