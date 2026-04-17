import { Logo } from '@/components/Logo';
import { VERTICAL_PRODUCTS } from '@/components/brand';

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid footer-grid-four">
        <div>
          <Logo
            subline="ONE PLATFORM. SPECIALIZED PACKAGES."
            className="logo-footer"
          />
          <p className="small">
            Care Axis is the parent platform for modern healthcare operations with specialized packages
            for PI, DPC, ortho, pain, and multi-specialty models.
          </p>
        </div>

        <div>
          <h4 className="panel-title">Product Family</h4>
          {VERTICAL_PRODUCTS.map((product) => (
            <p className="small" key={product.key}>
              <a href={product.href}>{product.fullName}</a>
            </p>
          ))}
        </div>

        <div>
          <h4 className="panel-title">Platform</h4>
          <p className="small"><a href="/platform">Why Care Axis</a></p>
          <p className="small"><a href="/features">Features</a></p>
          <p className="small"><a href="/verticals">Vertical Packages</a></p>
          <p className="small"><a href="/live-demo">Live Demo Sandbox</a></p>
          <p className="small"><a href="/about">About</a></p>
        </div>

        <div>
          <h4 className="panel-title">Conversion</h4>
          <p className="small"><a href="/pricing">Request pricing</a></p>
          <p className="small"><a href="/demo">Book a demo</a></p>
          <p className="small"><a href="/contact#quickstart-order">Start now</a></p>
          <p className="small"><a href="/login">Client Login</a></p>
          <p className="small"><a href="/portal">Client Portal</a></p>
          <p className="small"><a href="/admin">Admin Console</a></p>
          <p className="small">Email: <a href="mailto:hello@trycareaxis.com">hello@trycareaxis.com</a></p>
          <p className="small">Phone: <a href="tel:+18000000360">(800) 000-0360</a></p>
          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <a className="btn ghost" href="/book-call">Schedule a call</a>
            <a className="btn ghost" href="/contact">Start free trial</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
