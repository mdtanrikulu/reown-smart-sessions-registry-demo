import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAppKitAccount } from '@reown/appkit/react';
import { useRegistry } from "@/hooks/useRegistry";
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { Loader2 } from 'lucide-react';
import { useRegistryContext } from "@/context/RegistryContextProvider";
import { isSmartSessionSupported } from '@reown/appkit-experimental/smart-session';

function RegistryForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      assetToAllocate: 'eth',
      assetToBuy: 'donut',
      intervalUnit: 'minute',
      allocationAmount: 0,
      investmentInterval: 0,
      numberOfOrders: 0,
    },
  });
  const { address, status } = useAppKitAccount();
  const { createCommitStrategy } = useRegistry();
  const { smartSession } = useRegistryContext();
  const [isLoading, setLoading] = React.useState(false);
  const isSupported = useMemo(
    () => isSmartSessionSupported(),
    [status, address]
  );

  const isWalletConnecting =
    status === 'connecting' || status === 'reconnecting';

    async function executeCommit() {
      try {
        await fetch("/api/registry/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            strategy: {},
            permissions: smartSession?.grantedPermissions,
          }),
        });
      } catch (error) {
        console.error("Error executing DCA:", error);
      }
    }

  async function onSubmit() {
    try {
      setLoading(true);
      await createCommitStrategy();
    } catch (e) {
      toast("Error", {
        description: (e as Error)?.message || "Error creating commit strategy",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Commit & Reveal to the Registry</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4"></CardContent>
        <CardFooter>
          {isWalletConnecting ? (
            <Button className="w-full bg-blue-500 hover:bg-blue-700" disabled>
              Reconnecting Wallet...
            </Button>
          ) : status !== 'connected' && !address ? (
            <ConnectWalletButton />
          ) : !isSupported ? (
            <Button className="w-full bg-blue-500 hover:bg-blue-700" disabled>
              Unsupported Wallet
            </Button>
          ) : (
            <Button
                type="submit"
                name="commit"
                className="w-full bg-blue-500 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  'Commit'
                )}
              </Button>
          )}
          {/* <div>
              
              <Button
                type="submit"
                name="reveal"
                className="w-full bg-blue-500 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  'Reveal'
                )}
              </Button>
            </div> */}
        </CardFooter>
      </form>
    </Card>
  );
}

export default RegistryForm;
