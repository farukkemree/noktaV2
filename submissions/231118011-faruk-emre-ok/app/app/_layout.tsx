import { Slot, usePathname } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { captureRef, captureScreen } from "react-native-view-shot";
import * as MobileAudit from "@xtatistix/mobile-audit";
import type { AuditNote, AuditStorage } from "@xtatistix/mobile-audit";

const NOTE_FILE = "nokta-audit-notes.json";
const reporterId = process.env.EXPO_PUBLIC_REPORTER_ID ?? "231118011-track-a";

function storageUri() {
  const baseUri = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? "";
  return `${baseUri}${NOTE_FILE}`;
}

function safeName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function routeToScreen(pathname: string) {
  if (pathname === "/reports") {
    return "Reports";
  }

  if (pathname === "/forge") {
    return "Forge";
  }

  return "Capture";
}

const storage: AuditStorage = {
  async loadNotes(): Promise<AuditNote[]> {
    try {
      const uri = storageUri();
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        return [];
      }

      const raw = await FileSystem.readAsStringAsync(uri);
      const notes = JSON.parse(raw);
      return Array.isArray(notes) ? notes : [];
    } catch {
      return [];
    }
  },
  async saveNotes(notes: AuditNote[]): Promise<void> {
    await FileSystem.writeAsStringAsync(storageUri(), JSON.stringify(notes, null, 2));
  }
};

export default function RootLayout() {
  const pathname = usePathname();
  const currentScreen = routeToScreen(pathname);

  const deps = useMemo(
    () => ({
      captureScreen: () => captureScreen({ format: "png", result: "tmpfile" }),
      captureRef: (ref: unknown) => captureRef(ref as never, { format: "png", result: "tmpfile" }),
      writeFile: async (filename: string, content: string) => {
        const uri = `${FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? ""}${safeName(filename)}`;
        await FileSystem.writeAsStringAsync(uri, content);
        return uri;
      },
      writeFileBinary: async (filename: string, base64: string) => {
        const uri = `${FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? ""}${safeName(filename)}`;
        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return uri;
      },
      shareFile: async (uri: string) => {
        await Sharing.shareAsync(uri);
      },
      storage,
      currentScreen,
      reporterId,
      BugIcon: <Text style={styles.auditIcon}>!</Text>
    }),
    [currentScreen]
  );

  return (
    <SafeAreaProvider>
      <Slot />
      <MobileAudit.AuditWidget appName="Nokta Audit Forge" deps={deps} initialPosition={{ bottom: 96, right: 16 }} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  auditIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 28
  }
});
