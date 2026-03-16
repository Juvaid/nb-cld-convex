async function main() {
  const rs = await fetch("https://calculating-hyena-431.eu-west-1.convex.cloud/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "siteSettings:getInternal",
      args: {},
      format: "json"
    })
  }).then(res => res.json());

  console.log(JSON.stringify(rs, null, 2));
}

main().catch(console.error);
