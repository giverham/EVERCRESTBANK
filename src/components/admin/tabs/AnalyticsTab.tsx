import { Card } from "../../ui/Card";
export function AnalyticsTab({ customerId: _customerId }: { customerId: string }) {
  /* In a real application, you would aggregate transaction data for the specific customer here. */ /* For this demo, we'll show a simplified static view to represent the analytics. */ return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {" "}
      <Card className="p-6">
        {" "}
        <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-6">
          Customer Analytics
        </h2>{" "}
        <p className="text-secondary-500 mb-6">
          Live charts will aggregate from the transactions table.
        </p>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {" "}
          <div className="h-64 bg-secondary-50 dark:bg-secondary-900 rounded-xl flex items-center justify-center">
            {" "}
            <p className="text-secondary-400 font-medium">
              Monthly Spending Chart
            </p>{" "}
          </div>{" "}
          <div className="h-64 bg-secondary-50 dark:bg-secondary-900 rounded-xl flex items-center justify-center">
            {" "}
            <p className="text-secondary-400 font-medium">
              Category Breakdown
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}
