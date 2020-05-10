using _12PMLunch.API.DAL;
using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace _12PMLunch.API.Handlers
{
    public class MessageInterceptHandler : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {

            // CATCH THE REQUEST BEFORE SENDING TO THE ROUTING HANDLER
            var headers = request.ToString();
            var body = request.Content.ReadAsStringAsync().Result;
            var fullRequest = headers + "\n" + body;
            Log.Info(fullRequest);

            // SETUP A CALLBACK FOR CATCHING THE RESPONSE - AFTER ROUTING HANDLER, AND AFTER CONTROLLER ACTIVITY
            return base.SendAsync(request, cancellationToken).ContinueWith(
                        task =>
                        {
                            // GET THE COPY OF THE TASK, AND PASS TO A CUSTOM ROUTINE
                            ResponseHandler(task);

                            // RETURN THE ORIGINAL RESULT
                            var response = task.Result;
                            return response;
                        }
            );
        }

        public void ResponseHandler(Task<HttpResponseMessage> task)
        {
            string body = string.Empty;
            var headers = task.Result.ToString();
            if (task.Result.Content != null)
                body = task.Result.Content.ReadAsStringAsync().Result;
            var fullResponse = headers + "\n" + body;
            Log.Info(fullResponse);
        }
    }
}