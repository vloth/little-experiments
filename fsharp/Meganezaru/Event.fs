namespace Meganezaru.Watcher
open System.IO
open Microsoft.Extensions.FileProviders

module File =
    let watchEvents path =
        let watcher = new PhysicalFileProvider(Path.Combine (Directory.GetCurrentDirectory(), path))
        let rec watch =  fun () ->
            let token = watcher.Watch "*.event"
            let notify = System.Action<obj>(fun (obj) -> printfn "changed! %O" obj
                                                         watch ())
            token.RegisterChangeCallback (notify, Unchecked.defaultof<obj>) |> ignore
        watch ()

namespace Meganezaru.Event
open System.Threading.Tasks;
open Microsoft.AspNetCore.SignalR
open Microsoft.AspNetCore.Mvc

type IEventHubClient = abstract member EventBroadcast : event:string -> Task
type Hub () = inherit Hub<IEventHubClient>()

module ActionResult =
    let ofAsync (res: Async<IActionResult>) =
        res |> Async.StartAsTask

[<ApiController>]
[<Route("api/[controller]")>]
type EventController (hub: IHubContext<Hub, IEventHubClient>) =
    inherit ControllerBase()

    [<HttpGet("{event}")>]
    member __.Get(event) =
        ActionResult.ofAsync <| async {
            do! hub.Clients.All.EventBroadcast event |> Async.AwaitTask
            let msg = sprintf "event %s broadcasted successfully" event
            return __.Ok msg :> _ }