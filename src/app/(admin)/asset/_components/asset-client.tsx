"use client";

import { useState, useTransition } from "react";
import { Plus, ArrowRightLeft, Package, MapPin } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createAssetAction,
  transferAssetAction,
  createLocationAction
} from "@/features/asset/actions";
import type { AssetDto, AssetLocationDto, AssetCategoryDto } from "@/features/asset/server";

export function AssetClient({ 
  initialAssets, 
  locations,
  categories,
  custodians,
  canWrite,
  canTransfer,
  canManage 
}: { 
  initialAssets: AssetDto[];
  locations: AssetLocationDto[];
  categories: AssetCategoryDto[];
  custodians: any[];
  canWrite: boolean;
  canTransfer: boolean;
  canManage: boolean;
}) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<"assets" | "locations">("assets");
  const [isPending, startTransition] = useTransition();

  // Asset Modal
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assetNumber, setAssetNumber] = useState("");
  const [assetName, setAssetName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [custodianId, setCustodianId] = useState("");

  // Transfer Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState<AssetDto | null>(null);
  const [toLocationId, setToLocationId] = useState("");
  const [toCustodianId, setToCustodianId] = useState("");
  const [transferReason, setTransferReason] = useState("");

  // Location Modal
  const [locModalOpen, setLocModalOpen] = useState(false);
  const [locName, setLocName] = useState("");
  const [locBuilding, setLocBuilding] = useState("");
  const [locFloor, setLocFloor] = useState("");
  const [locRoom, setLocRoom] = useState("");

  const handleSaveAsset = () => {
    if (!assetNumber || !assetName || !categoryId || !locationId || !custodianId) {
      return toast.error(t("common.required"));
    }
    startTransition(async () => {
      const res = await createAssetAction({
        assetNumber,
        name: assetName,
        categoryId,
        locationId,
        custodianId,
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setAssetModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openTransfer = (asset: AssetDto) => {
    setActiveAsset(asset);
    setToLocationId(asset.locationId);
    setToCustodianId(asset.custodianId);
    setTransferReason("");
    setTransferModalOpen(true);
  };

  const handleSaveTransfer = () => {
    if (!activeAsset || !toLocationId || !toCustodianId) return toast.error(t("common.required"));
    startTransition(async () => {
      const res = await transferAssetAction({
        assetId: activeAsset.id,
        toLocationId,
        toCustodianId,
        reason: transferReason
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setTransferModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleSaveLocation = () => {
    if (!locName || !locBuilding || !locFloor || !locRoom) return toast.error(t("common.required"));
    startTransition(async () => {
      const res = await createLocationAction({
        name: locName,
        building: locBuilding,
        floor: locFloor,
        room: locRoom
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setLocModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (s: string) => {
    switch (s) {
      case "ACTIVE": return "ok";
      case "DISPOSED": case "LOST": return "bad";
      case "UNDER_REPAIR": return "warn";
      default: return "info";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("asset.title")}</h1>
          <p className="text-muted-foreground">{t("asset.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {canWrite && activeTab === "assets" && (
            <Button onClick={() => setAssetModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Asset
            </Button>
          )}
          {canManage && activeTab === "locations" && (
            <Button onClick={() => setLocModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Location
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b">
        <button 
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "assets" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("assets")}
        >
          {t("asset.tab.assets")}
        </button>
        {canManage && (
          <button 
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "locations" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("locations")}
          >
            {t("asset.tab.locations")}
          </button>
        )}
      </div>

      {activeTab === "assets" && (
        <div className="bg-card border rounded-xl shadow-sm">
          <DataTable
            state={initialAssets.length === 0 ? "empty" : "data"}
            rows={initialAssets}
            getRowId={(d: AssetDto) => d.id}
            headHeading={t("asset.tab.assets")}
            empty={{ icon: <Package className="h-8 w-8" />, title: t("common.noData") }}
            error={{ icon: <Package className="h-8 w-8" />, title: t("common.error") }}
            columns={[
              {
                key: "number",
                header: t("asset.col.number"),
                render: (d: AssetDto) => <div className="font-medium text-sm">{d.assetNumber}</div>
              },
              {
                key: "name",
                header: t("asset.col.name"),
                render: (d: any) => <div className="text-sm">{d.name}</div>
              },
              {
                key: "location",
                header: t("asset.col.location"),
                render: (d: any) => <div className="text-sm">{d.location?.name} ({d.location?.room})</div>
              },
              {
                key: "custodian",
                header: "Custodian",
                render: (d: any) => <div className="text-sm">{d.custodian ? `${d.custodian.firstNameTh} ${d.custodian.lastNameTh}` : "-"}</div>
              },
              {
                key: "status",
                header: t("asset.col.status"),
                render: (d: any) => (
                  <StatusPill tone={getStatusTone(d.status) as any}>
                    {t(`asset.status.${d.status}` as any) || d.status}
                  </StatusPill>
                )
              },
              {
                key: "actions",
                header: "",
                render: (d: any) => (
                  <div className="flex items-center justify-end gap-2">
                    {canTransfer && d.status === "ACTIVE" && (
                      <Button variant="ghost" size="sm" onClick={() => openTransfer(d)}>
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      )}

      {activeTab === "locations" && canManage && (
        <div className="bg-card border rounded-xl shadow-sm">
          <DataTable
            state={locations.length === 0 ? "empty" : "data"}
            rows={locations}
            getRowId={(d: AssetLocationDto) => d.id}
            headHeading={t("asset.tab.locations")}
            empty={{ icon: <MapPin className="h-8 w-8" />, title: t("common.noData") }}
            error={{ icon: <MapPin className="h-8 w-8" />, title: t("common.error") }}
            columns={[
              {
                key: "name",
                header: "Location Name",
                render: (d: AssetLocationDto) => <div className="font-medium text-sm">{d.name}</div>
              },
              {
                key: "building",
                header: "Building",
                render: (d: any) => <div className="text-sm">{d.building}</div>
              },
              {
                key: "room",
                header: "Room/Floor",
                render: (d: any) => <div className="text-sm">{d.room} (Fl. {d.floor})</div>
              }
            ]}
          />
        </div>
      )}

      {/* Asset Modal */}
      <LiyonDialog open={assetModalOpen} onOpenChange={setAssetModalOpen}>
        <LiyonDialogHeader title="New Asset" />
        <div className="p-6 space-y-4">
          <LiyonField label={t("asset.col.number")}>
            <input 
              value={assetNumber} 
              onChange={(e) => setAssetNumber(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("asset.col.name")}>
            <input 
              value={assetName} 
              onChange={(e) => setAssetName(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Category">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameTh}</option>)}
            </select>
          </LiyonField>
          <LiyonField label="Location">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              <option value="">-- Select Location --</option>
              {locations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </LiyonField>
          <LiyonField label="Custodian (Personnel)">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={custodianId}
              onChange={(e) => setCustodianId(e.target.value)}
            >
              <option value="">-- Select Custodian --</option>
              {custodians.map((c: any) => <option key={c.id} value={c.id}>{c.firstNameTh} {c.lastNameTh}</option>)}
            </select>
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setAssetModalOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleSaveAsset} disabled={isPending}>{t("common.save")}</Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Transfer Modal */}
      <LiyonDialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <LiyonDialogHeader title="Transfer Asset" />
        <div className="p-6 space-y-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <div><strong>Asset:</strong> {activeAsset?.assetNumber} - {activeAsset?.name}</div>
          </div>
          <LiyonField label="New Location">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={toLocationId}
              onChange={(e) => setToLocationId(e.target.value)}
            >
              {locations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </LiyonField>
          <LiyonField label="New Custodian">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={toCustodianId}
              onChange={(e) => setToCustodianId(e.target.value)}
            >
              {custodians.map((c: any) => <option key={c.id} value={c.id}>{c.firstNameTh} {c.lastNameTh}</option>)}
            </select>
          </LiyonField>
          <LiyonField label="Reason">
            <input 
              value={transferReason} 
              onChange={(e) => setTransferReason(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setTransferModalOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleSaveTransfer} disabled={isPending}>Transfer</Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Location Modal */}
      <LiyonDialog open={locModalOpen} onOpenChange={setLocModalOpen}>
        <LiyonDialogHeader title="New Location" />
        <div className="p-6 space-y-4">
          <LiyonField label="Name">
            <input 
              value={locName} 
              onChange={(e) => setLocName(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </LiyonField>
          <LiyonField label="Building">
            <input 
              value={locBuilding} 
              onChange={(e) => setLocBuilding(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </LiyonField>
          <LiyonField label="Floor">
            <input 
              value={locFloor} 
              onChange={(e) => setLocFloor(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </LiyonField>
          <LiyonField label="Room">
            <input 
              value={locRoom} 
              onChange={(e) => setLocRoom(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setLocModalOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleSaveLocation} disabled={isPending}>{t("common.save")}</Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
