export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          Made with ❤ by{' '}
          <a
            href="https://www.instagram.com/polito_lima/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Polito
          </a>
        </div>
      </div>
    </footer>
  );
}