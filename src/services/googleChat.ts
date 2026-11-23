import { DiagnosisResult } from '../types/disease';

export interface ChatSpace {
  name: string; // e.g. "spaces/AAAAAAAAAAA"
  displayName: string;
  type: string;
  spaceType?: string;
}

/**
 * Format a DiagnosisResult into a clean, markdown-formatted dispatch for Google Chat
 */
export function formatDiagnosticChatMessage(result: DiagnosisResult, customNote?: string): string {
  const isHealthy = result.diseaseId === 'healthy';
  const headerIcon = isHealthy ? '🌿' : '🚨';
  const severityBadge = result.severity.toUpperCase();

  const primaryTreatments = result.treatment.organic.slice(0, 3).map((item) => `• ${item}`).join('\n');
  const culturalTips = result.treatment.cultural.slice(0, 2).map((item) => `• ${item}`).join('\n');

  let message = `${headerIcon} *[AgroVision AI - Botanical Pathology Alert]*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Plant Condition:* ${result.diseaseName}\n`;
  message += `*Scientific Pathogen:* _${result.scientificName}_\n`;
  message += `*Diagnostic Certainty:* ${result.confidence}% | *Severity Stage:* ${severityBadge}\n`;
  message += `*Species Verification:* Solanum lycopersicum (Verified Tomato Foliage)\n\n`;

  message += `*Field Health Summary:*\n${result.summary}\n\n`;

  if (result.treatment.organic.length > 0) {
    message += `*Recommended Organic Care (Sindh/Punjab Field Protocol):*\n${primaryTreatments}\n\n`;
  }

  if (result.treatment.cultural.length > 0) {
    message += `*Preventative Canopy & Irrigation Guidance:*\n${culturalTips}\n\n`;
  }

  if (customNote && customNote.trim()) {
    message += `*Field Inspector Note:* ${customNote.trim()}\n\n`;
  }

  message += `_Dispatched via AgroVision AI | Penn State & EPFL PlantVillage Benchmark_`;

  return message;
}

/**
 * List Google Chat spaces accessible with user OAuth token
 */
export async function listChatSpaces(accessToken: string): Promise<ChatSpace[]> {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Failed to fetch Google Chat spaces (HTTP ${response.status}). Ensure the Google Chat API is configured in the Google Cloud project.`
    );
  }

  const data = await response.json();
  const spaces: ChatSpace[] = (data.spaces || []).map((s: any) => ({
    name: s.name,
    displayName: s.displayName || s.name.replace('spaces/', 'Space '),
    type: s.type || 'SPACE',
    spaceType: s.spaceType
  }));

  return spaces;
}

/**
 * Send message to a Google Chat space via Workspace API
 */
export async function sendChatMessageToSpace(
  spaceName: string,
  messageText: string,
  accessToken: string
): Promise<{ success: boolean; messageId?: string }> {
  // Ensure space format
  const formattedSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;

  const response = await fetch(`https://chat.googleapis.com/v1/${formattedSpace}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: messageText
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Google Chat API returned HTTP ${response.status}: Failed to dispatch report.`
    );
  }

  const result = await response.json();
  return { success: true, messageId: result.name };
}

/**
 * Send message directly via Google Chat Incoming Webhook
 */
export async function sendChatMessageViaWebhook(
  webhookUrl: string,
  messageText: string
): Promise<{ success: boolean }> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: messageText
    })
  });

  if (!response.ok) {
    throw new Error(`Google Chat Webhook failed with HTTP ${response.status}. Please check your webhook URL.`);
  }

  return { success: true };
}
