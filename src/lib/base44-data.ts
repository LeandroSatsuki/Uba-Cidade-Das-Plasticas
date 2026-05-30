import type {
  Base44Content,
  Base44ContentLike,
  Base44Professional,
  Base44Subscription,
  Base44User,
  Base44WhatsAppContact,
} from "@/types/base44";

import professionalsJson from "../../data/base44/professionals.json";
import contentsJson from "../../data/base44/contents.json";
import usersJson from "../../data/base44/users.json";
import contentLikesJson from "../../data/base44/content-likes.json";
import whatsappContactsJson from "../../data/base44/whatsapp-contacts.json";
import subscriptionsJson from "../../data/base44/subscriptions.json";

export const base44Professionals = professionalsJson as Base44Professional[];
export const base44Contents = contentsJson as Base44Content[];
export const base44Users = usersJson as Base44User[];
export const base44ContentLikes = contentLikesJson as Base44ContentLike[];
export const base44WhatsAppContacts = whatsappContactsJson as Base44WhatsAppContact[];
export const base44Subscriptions = subscriptionsJson as Base44Subscription[];

export const base44MigrationSummary = {
  professionals: base44Professionals.length,
  contents: base44Contents.length,
  users: base44Users.length,
  contentLikes: base44ContentLikes.length,
  whatsappContacts: base44WhatsAppContacts.length,
  subscriptions: base44Subscriptions.length,
};
