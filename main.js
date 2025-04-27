Hooks.once("init", () => {
  console.log("Quick Rolls | init");
});

Hooks.on("renderActorSheet", (app, html) => {
  if (game.system.id !== "pf2e") return;
  if (!["character", "npc"].includes(app.actor.type)) return;

  html.find("div.subsection.attributes ul li.attribute").each((i, li) => {
    const $li = $(li);
    const ab  = $li.attr("data-attribute");
    if (!ab) return;

    const $mod = $li.find("h3.modifier");
    if (!$mod.length || $mod.next(".quick-roll").length) return;

    const $btn = $(`
      <button class="quick-roll">
        <div class="d20-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 19 19" preserveAspectRatio="xMinYMin meet">
            <path fill-rule="evenodd" fill="currentColor"
              d="M3.826,8.060 L0.124,13.540 C0.016,13.716 0.127,13.944 0.332,13.967 L7.637,14.743 L3.826,8.060 L3.826,8.060 Z
                 M0.341,11.589 L2.983,7.288 L0.294,5.672 C0.200,5.615 0.081,5.683 0.081,5.792 L0.081,11.515 C0.081,11.657 0.267,11.710 0.341,11.589 Z
                 M0.722,15.391 L7.541,18.472 C7.727,18.559 7.939,18.422 7.939,18.217 L7.939,15.909 L0.799,15.125 C0.643,15.107 0.580,15.321 0.722,15.391 L0.722,15.391 Z
                 M3.571,6.330 L6.375,1.305 C6.527,1.057 6.249,0.769 5.996,0.913 L0.706,4.380 C0.620,4.437 0.622,4.565 0.711,4.618 L3.571,6.330 L3.571,6.330 Z
                 M8.500,6.687 L12.331,6.687 L8.978,0.769 C8.869,0.590 8.684,0.501 8.500,0.501 C8.316,0.501 8.132,0.590 8.022,0.769 L4.669,6.687 L8.500,6.687 Z
                 M16.707,5.672 L14.018,7.288 L16.659,11.589 C16.733,11.710 16.919,11.657 16.919,11.515 L16.919,5.792 C16.919,5.683 16.800,5.615 16.707,5.672 Z
                 M13.430,6.330 L16.290,4.618 C16.379,4.564 16.381,4.436 16.294,4.379 L11.004,0.913 C10.752,0.769 10.474,1.057 10.626,1.305 L13.430,6.330 L13.430,6.330 Z
                 M16.202,15.125 L9.062,15.908 L9.062,18.217 C9.062,18.422 9.274,18.558 9.460,18.472 L16.279,15.391 C16.420,15.321 16.358,15.107 16.202,15.125 L16.202,15.125 Z
                 M13.175,8.060 L9.364,14.743 L16.669,13.967 C16.874,13.944 16.986,13.716 16.877,13.540 L13.175,8.060 L13.175,8.060 Z
                 M8.500,7.812 L4.977,7.812 L8.500,13.990 L12.023,7.812 L8.500,7.812 Z"/>
          </svg>
        </div>
      </button>
    `);
    $mod.after($btn);

    $btn.on("click", event => {
      event.preventDefault();
      const actor = app.actor;
      const mod   = actor.system.abilities?.[ab]?.mod ?? 0;
      const roll  = new Roll(`1d20 + ${mod}`, actor.getRollData());
      roll.evaluate().then(r => {
        r.toMessage({
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: `${ab.toUpperCase()} Check`
        });
      });
    });
  });
});
