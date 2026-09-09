#include <vector>
#include "./CreateFunc.h"

namespace Binary
{
  class App
  {
  public:
    App(char *binary);
    ~App();

  private:
    std::vector<CreateFunc *> *functions;
  };
}