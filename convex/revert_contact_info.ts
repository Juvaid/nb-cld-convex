import { mutation } from "./_generated/server";

export const execute = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Update site settings
    const updateSetting = async (key: string, value: any) => {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { value });
      } else {
        await ctx.db.insert("siteSettings", { key, value });
      }
    };

    await updateSetting("contactEmail", "naturesboon@yahoo.com");
    await updateSetting("contactPhone", "+91-9877659808");
    await updateSetting("workingHours", "Mon - Fri: 9:00 AM - 6:00 PM");
    await updateSetting("footerCopyrightText", `© ${new Date().getFullYear()} Nature's Boon. All rights reserved.`);

    // 2. Update Contact Page Data
    const contactPage = await ctx.db
      .query("pages")
      .withIndex("by_path", (q) => q.eq("path", "/contact"))
      .unique();

    if (contactPage && contactPage.publishedData) {
      let data = JSON.parse(contactPage.publishedData);
      
      if (data.content) {
        data.content = data.content.map((block: any) => {
          if (block.type === "ContactSection") {
            block.props.infoItems = [
              { label: 'Phone', value: '+91-9877659808', icon: 'Phone' },
              { label: 'Email', value: 'naturesboon@yahoo.com', icon: 'Mail' },
              { label: 'Factory Address', value: 'Pakhowal Rd, adj. Sri Chaitanya Techno School, Thakkarwal, Ludhiana, Punjab - 142022', icon: 'MapPin' },
              { label: 'Working Hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM', icon: 'Clock' },
            ];
            block.props.departmentEmails = [
              { label: 'Inquiry/Info', email: 'naturesboon@yahoo.com' },
              { label: 'Accounts', email: 'accounts.naturesboon@yahoo.com' },
              { label: 'Purchase', email: 'purchase.naturesboon@yahoo.com' },
              { label: 'Sales', email: 'sales.naturesboon@yahoo.com' },
              { label: 'Artwork/Designing', email: 'artwork.naturesboon@yahoo.com' },
              { label: 'Exports', email: 'Exports@lustercosmetics.in' },
              { label: 'Sales (Exports)', email: 'Sales@chitkaraexports.com' },
            ];
          }
          return block;
        });
      }

      await ctx.db.patch(contactPage._id, {
        publishedData: JSON.stringify(data),
        draftData: JSON.stringify(data),
      });
    }

    return "Successfully reverted contact information to Yahoo/Luster domain.";
  },
});
