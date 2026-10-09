export interface StationItem {
  id: string;
  name: string;
  ward_id: string;
  ward_name: string;
  status: "ACTIVE" | "INACTIVE" | string;
  live: boolean;
  heartbeat_fresh: boolean;
  online: boolean;
  last_seen_at: string;
  session_version: number;
}
