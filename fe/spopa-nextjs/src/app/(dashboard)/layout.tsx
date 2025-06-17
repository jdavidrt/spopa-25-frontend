import NavigationBar from '@/components/navbar';
import { Container } from 'reactstrap';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-column h-100">
      <NavigationBar />
      <Container className="flex-grow-1 mt-5">
        {children}
      </Container>
      <footer className="bg-light p-3 text-center">
        <p>SPOPA - 25 - Grupo 1E</p>
      </footer>
    </div>
  );
}