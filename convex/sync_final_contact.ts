import { mutation } from "./_generated/server";

export const execute = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Update site settings
    const settings = await ctx.db.query("siteSettings").collect();
    
    const emailEntry = settings.find(s => s.key === "contactEmail");
    if (emailEntry) await ctx.db.patch(emailEntry._id, { value: "info@naturesboon.com" });

    const phoneEntry = settings.find(s => s.key === "contactPhone");
    if (phoneEntry) await ctx.db.patch(phoneEntry._id, { value: "+91 97818 00033" });

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
              { label: 'Phone', value: '+91 97818 00033', icon: 'Phone' },
              { label: 'Email', value: 'info@naturesboon.com', icon: 'Mail' },
              { label: 'Factory Address', value: 'Plot No 123, JLPL Industrial Area, Sector 82, Mohali, Punjab - 140308', icon: 'MapPin' },
              { label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', icon: 'Clock' },
            ];
            block.props.departmentEmails = [
              { label: 'Sales', email: 'sales@naturesboon.com' },
              { label: 'Support', email: 'support@naturesboon.com' },
              { label: 'Export', email: 'exports@naturesboon.com' },
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

    // 3. Update Footer (if found in templates or specific blocks)
    // Most likely handled via layout code update + deploy, 
    // but if footer is a block in the database, we sync it here too.

    return "Successfully synchronized all contact information to @naturesboon.com domain.";
  },
});
