using System.Web.Mvc;
using System.Web.Routing;

namespace Membrane.Web.Public.Areas.Api
{
	public class ApiAreaRegistration : AreaRegistration
	{
		public override string AreaName
		{
			get { return "Api"; }
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute(
				"API_01.00_DATA",
				"api/1.0/data/{action}/{identifier}",
				new { controller = "DataVersion0100", identifier = UrlParameter.Optional });
		}
	}
}
