#include "../Core/List.h"
#include "./CreateFunc.h"

namespace Binary
{
  class App
  {
  public:
    App(char *binary);

  private:
    Core::List<CreateFunc *> *functions;
  };
}