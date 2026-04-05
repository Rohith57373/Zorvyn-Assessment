import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="panel max-w-lg rounded-[32px] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-300/70">Access restricted</p>
        <h3 className="mt-4 text-3xl font-semibold text-white">You do not have permission for this page</h3>
        <p className="mt-3 text-sm text-slate-400">
          Your current role does not allow access to this route. Return to the dashboard to continue.
        </p>
        <Link to="/app" className="mt-6 inline-flex">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
