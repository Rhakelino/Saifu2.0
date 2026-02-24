export default function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <span className="text-sm font-semibold text-muted-foreground">Saifu Made By Rhakelino</span>
                    <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Bantuan
                    </a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Privasi
                    </a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Ketentuan
                    </a>
                </div>
            </div>
        </footer>
    );
}
