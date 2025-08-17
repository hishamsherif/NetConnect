import { useEffect, useState } from 'react';
import { Navbar } from './components/ui/navbar';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Logo } from './components/ui/logo';

export default function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <Navbar onToggleTheme={() => setDark(d => !d)} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Logo Showcase */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-display font-display mb-4">Welcome to Nodal</h1>
          <p className="text-body text-muted max-w-2xl mx-auto">
            Your connections, mapped and remembered. A modern, minimal, and trustworthy platform for managing your professional network.
          </p>
        </section>

        {/* Logo Variants */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Logo Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-h3 font-display mb-4">Full Logo</h3>
                  <div className="flex justify-center mb-4">
                    <Logo size="md" />
                  </div>
                  <p className="text-small text-muted">Icon + Wordmark</p>
                </div>
                <div>
                  <h3 className="text-h3 font-display mb-4">Logo Only</h3>
                  <div className="flex justify-center mb-4">
                    <Logo size="md" logoOnly />
                  </div>
                  <p className="text-small text-muted">Icon Only</p>
                </div>
                <div>
                  <h3 className="text-h3 font-display mb-4">Sizes</h3>
                  <div className="space-y-4">
                    <Logo size="sm" />
                    <Logo size="md" />
                    <Logo size="lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Component Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted mb-5">Explore our design system components built with the Nodal brand.</p>
              <div className="flex gap-3 mb-6">
                <Button>Primary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex items-center gap-3">
                <Badge>New</Badge>
                <Badge variant="muted">Beta</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Name" />
                <Input placeholder="Company" />
                <Input placeholder="Email" type="email" />
                <div className="flex gap-3">
                  <Button className="flex-1">Save</Button>
                  <Button variant="ghost" className="flex-1">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Typography & Spacing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h1 className="text-display font-display mb-4">Display 48px</h1>
                <h2 className="text-h1 font-display mb-4">H1 36px</h2>
                <h3 className="text-h2 font-display mb-4">H2 28px</h3>
                <h4 className="text-h3 font-display mb-4">H3 22px</h4>
                <p className="text-body mb-4">Body 16px - Inter font with 1.5 line height</p>
                <p className="text-small mb-4">Small 14px - Inter font with 1.5 line height</p>
                <p className="text-caption mb-4">Caption 12px - Inter font with 1.5 line height</p>
              </div>
              
              <div>
                <h3 className="text-h3 font-display mb-4">Spacing Scale</h3>
                <div className="space-y-4">
                  <div className="bg-primary/20 h-4 w-4 rounded"></div>
                  <div className="bg-primary/20 h-8 w-8 rounded"></div>
                  <div className="bg-primary/20 h-12 w-12 rounded"></div>
                  <div className="bg-primary/20 h-16 w-16 rounded"></div>
                  <div className="bg-primary/20 h-20 w-20 rounded"></div>
                  <div className="bg-primary/20 h-24 w-24 rounded"></div>
                  <div className="bg-primary/20 h-32 w-32 rounded"></div>
                  <div className="bg-primary/20 h-40 w-40 rounded"></div>
                  <div className="bg-primary/20 h-48 w-48 rounded"></div>
                </div>
              </div>

              <div>
                <h3 className="text-h3 font-display mb-4">Border Radius</h3>
                <div className="flex gap-4 items-center">
                  <div className="bg-primary/20 h-16 w-16 rounded-sm"></div>
                  <div className="bg-primary/20 h-16 w-16 rounded-md"></div>
                  <div className="bg-primary/20 h-16 w-16 rounded-lg"></div>
                  <div className="bg-primary/20 h-16 w-16 rounded-pill"></div>
                </div>
              </div>

              <div>
                <h3 className="text-h3 font-display mb-4">Shadows</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-surface border border-border rounded-lg shadow-sm p-6 text-center">
                    <p className="text-sm text-muted">Shadow SM</p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg shadow-md p-6 text-center">
                    <p className="text-sm text-muted">Shadow MD</p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg shadow-lg p-6 text-center">
                    <p className="text-sm text-muted">Shadow LG</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
