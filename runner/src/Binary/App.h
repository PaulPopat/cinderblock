#include "./List.h"
#include "./CreateFunc.h"

namespace Binary
{
  class App
  {
  public:
    App(char *binary);

  private:
    List<CreateFunc *> *functions;
  };
}